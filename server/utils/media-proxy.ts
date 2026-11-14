import type { H3Event } from 'h3'

/**
 * Streams a media file from the Clinika API. The browser's Range header is passed through, so the player
 * starts at once and seeks without downloading the whole file.
 */
export function proxyMedia(event: H3Event, path: string) {
  const { backendUrl } = useRuntimeConfig()
  const range = getRequestHeader(event, 'range')
  return proxyRequest(event, `${backendUrl.replace(/\/+$/, '')}${path}`, { headers: range ? { range } : {} })
}
