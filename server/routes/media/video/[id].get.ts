/**
 * Article video, streamed from the Clinika API. The browser's Range header is passed through,
 * so the player can start at once and seek without downloading the whole file.
 */
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id') ?? ''
  if (!UUID.test(id)) throw createError({ statusCode: 404 })
  const { backendUrl } = useRuntimeConfig()
  const range = getRequestHeader(event, 'range')
  return proxyRequest(event, `${backendUrl.replace(/\/+$/, '')}/website/articles/${id}/video`, {
    headers: range ? { range } : {},
    fetchOptions: { headers: { accept: 'video/*' } },
  })
})
