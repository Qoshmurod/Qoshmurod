/** Default quality (best up to 1080p), for links and players without a quality menu. */
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id') ?? ''
  if (!UUID.test(id)) throw createError({ statusCode: 404 })
  return proxyMedia(event, `/website/articles/${id}/video`)
})
