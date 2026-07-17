import {useEffect, useRef, useState} from 'react'
import {Card, Flex, Spinner, Stack, Text} from '@sanity/ui'
import {ObjectInputProps, set, useClient} from 'sanity'
import {requestGalleryAlt} from '../lib/siteApi'

type ImageValue = {
  alt?: string
  asset?: {_ref?: string}
  altSourceAssetId?: string
}

export function AutoAltImageInput(props: ObjectInputProps) {
  const {value, onChange, renderDefault} = props
  const client = useClient({apiVersion: '2026-05-15'})
  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'error'>(
    'idle',
  )
  const [error, setError] = useState<string | null>(null)
  const inflightRef = useRef<string | null>(null)

  const image = value as ImageValue | undefined
  const assetId = image?.asset?._ref
  const altSource = image?.altSourceAssetId

  useEffect(() => {
    if (!assetId) {
      setStatus('idle')
      setError(null)
      inflightRef.current = null
      return
    }

    if (assetId === altSource) {
      setStatus(image?.alt?.trim() ? 'done' : 'idle')
      return
    }

    // Keep existing manual alt; only stamp the tracking id.
    if (!altSource && image?.alt?.trim()) {
      onChange([set(assetId, ['altSourceAssetId'])])
      setStatus('done')
      return
    }

    if (inflightRef.current === assetId) return

    let cancelled = false
    inflightRef.current = assetId
    setStatus('working')
    setError(null)

    ;(async () => {
      try {
        const url = await client.fetch<string | null>(
          `*[_id == $id][0].url`,
          {id: assetId},
        )
        if (!url) throw new Error('Could not resolve image URL')
        if (cancelled) return

        const alt = await requestGalleryAlt(url)
        if (cancelled) return

        onChange([set(alt, ['alt']), set(assetId, ['altSourceAssetId'])])
        setStatus('done')
      } catch (err) {
        if (cancelled) return
        inflightRef.current = null
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Alt generation failed')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [assetId, altSource, client, onChange, image?.alt?.trim()])

  return (
    <Stack space={3}>
      {renderDefault(props)}
      {status === 'working' ? (
        <Card padding={3} radius={2} tone="primary" border>
          <Flex align="center" gap={2}>
            <Spinner muted />
            <Text size={1}>Generating alt text…</Text>
          </Flex>
        </Card>
      ) : null}
      {status === 'done' && assetId ? (
        <Text size={1} muted>
          Alt text auto-generated. Edit anytime.
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
