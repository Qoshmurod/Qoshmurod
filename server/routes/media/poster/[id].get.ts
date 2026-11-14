/** A frame of the article video, shown before it plays (when the article has no cover). */
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id') ?? ''
  if (!UUID.test(id)) throw createError({ statusCode: 404 })
  return proxyMedia(event, `/website/articles/${id}/poster`)
})
