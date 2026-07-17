import {useEffect, useRef, useState} from 'react'
import {Card, Flex, Spinner, Stack, Text} from '@sanity/ui'
import {ObjectInputProps, set, unset, useClient} from 'sanity'
import {requestGalleryAlt} from '../lib/siteApi'

type ClipValue = {
  alt?: string
  video?: {asset?: {_ref?: string}}
  poster?: {asset?: {_ref?: string}}
  posterSourceVideoId?: string
}

function captureFirstFrame(videoUrl: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.src = videoUrl

    let settled = false
    const fail = (message: string) => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error(message))
    }

    const cleanup = () => {
      video.removeAttribute('src')
      video.load()
    }

    const capture = () => {
      if (settled) return
      const width = video.videoWidth
      const height = video.videoHeight
      if (!width || !height) {
        fail('Could not read video dimensions')
        return
      }

      const maxWidth = 1200
      const scale = Math.min(1, maxWidth / width)
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(width * scale))
      canvas.height = Math.max(1, Math.round(height * scale))
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        fail('Canvas unavailable')
        return
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => {
          if (settled) return
          settled = true
          cleanup()
          if (!blob) {
            reject(new Error('Failed to encode thumbnail'))
            return
          }
          resolve(blob)
        },
        'image/jpeg',
        0.86,
      )
    }

    video.addEventListener(
      'loadeddata',
      () => {
        // Nudge off absolute 0 — some clips are black on the first sample.
        try {
          video.currentTime = Math.min(0.1, (video.duration || 1) * 0.01)
        } catch {
          capture()
        }
      },
      {once: true},
    )
    video.addEventListener('seeked', capture, {once: true})
    video.addEventListener(
      'error',
      () => fail('Could not load video for thumbnail'),
      {once: true},
    )
  })
}

export function GalleryClipInput(props: ObjectInputProps) {
  const {value, onChange, renderDefault} = props
  const client = useClient({apiVersion: '2026-05-15'})
  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'error'>(
    'idle',
  )
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inflightRef = useRef<string | null>(null)

  const clip = value as ClipValue | undefined
  const videoId = clip?.video?.asset?._ref
  const posterSource = clip?.posterSourceVideoId

  useEffect(() => {
    if (!videoId) {
      if (posterSource || clip?.poster?.asset?._ref) {
        onChange([unset(['poster']), unset(['posterSourceVideoId'])])
      }
      setStatus('idle')
      setMessage(null)
      setError(null)
      inflightRef.current = null
      return
    }

    if (videoId === posterSource) {
      setStatus('done')
      setMessage('Thumbnail and alt text ready. Edit alt anytime.')
      return
    }

    // Existing clips already have a poster but no tracking id — don't regenerate.
    if (!posterSource && clip?.poster?.asset?._ref) {
      onChange([set(videoId, ['posterSourceVideoId'])])
      setStatus('done')
      setMessage('Existing thumbnail kept.')
      return
    }

    if (inflightRef.current === videoId) return

    let cancelled = false
    inflightRef.current = videoId
    setStatus('working')
    setMessage('Generating thumbnail from the first frame…')
    setError(null)

    ;(async () => {
      try {
        const url = await client.fetch<string | null>(
          `*[_id == $id][0].url`,
          {id: videoId},
        )
        if (!url) throw new Error('Could not resolve video URL from Sanity')

        const blob = await captureFirstFrame(url)
        if (cancelled) return

        const asset = await client.assets.upload('image', blob, {
          filename: `gallery-poster-${videoId.slice(-12)}.jpg`,
          contentType: 'image/jpeg',
        })
        if (cancelled) return

        const patches = [
          set(
            {
              _type: 'image',
              asset: {_type: 'reference', _ref: asset._id},
            },
            ['poster'],
          ),
          set(videoId, ['posterSourceVideoId']),
        ]

        const posterUrl =
          typeof asset.url === 'string' && asset.url
            ? asset.url
            : await client.fetch<string | null>(`*[_id == $id][0].url`, {
                id: asset._id,
              })

        if (posterUrl) {
          setMessage('Writing alt text from the thumbnail…')
          try {
            const alt = await requestGalleryAlt(posterUrl)
            if (cancelled) return
            if (alt) patches.push(set(alt, ['alt']))
          } catch (altErr) {
            // Poster still succeeded — don't fail the whole upload.
            console.warn(altErr)
            setMessage(
              'Thumbnail ready. Alt text could not be generated — add it manually.',
            )
          }
        }

        if (cancelled) return
        onChange(patches)
        setStatus('done')
        setMessage((current) =>
          current?.includes('could not')
            ? current
            : 'Thumbnail and alt text auto-generated. Edit alt anytime.',
        )
      } catch (err) {
        if (cancelled) return
        inflightRef.current = null
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Thumbnail failed')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [videoId, posterSource, client, onChange, clip?.poster?.asset?._ref])

  return (
    <Stack space={3}>
      {renderDefault(props)}
      {status === 'working' ? (
        <Card padding={3} radius={2} tone="primary" border>
          <Flex align="center" gap={2}>
            <Spinner muted />
            <Text size={1}>{message || 'Working…'}</Text>
          </Flex>
        </Card>
      ) : null}
      {status === 'done' && videoId && message ? (
        <Text size={1} muted>
          {message}
        </Text>
      ) : null}
      {status === 'error' && error ? (
        <Card padding={3} radius={2} tone="critical" border>
          <Text size={1}>{error}</Text>
        </Card>
      ) : null}
    </Stack>
  )
}
