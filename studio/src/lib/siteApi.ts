const DEFAULT_SITE_URL = 'https://www.genamedure.com'

export function getSiteUrl() {
  return (
    process.env.SANITY_STUDIO_SITE_URL?.replace(/\/$/, '') || DEFAULT_SITE_URL
  )
}

export async function requestGalleryAlt(imageUrl: string): Promise<string | null> {
  const response = await fetch(`${getSiteUrl()}/api/gallery/alt`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({imageUrl}),
  })
  const data = (await response.json()) as {ok?: boolean; alt?: string; error?: string}
  if (!response.ok || !data.ok || !data.alt?.trim()) {
    throw new Error(data.error || 'Alt generation failed')
  }
  return data.alt.trim()
}
