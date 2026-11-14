const QUALITIES = new Set(['2160', '1440', '1080', '720', '480', '360'])

/** One quality of an article video: /media/video/<id>/720 */
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id') ?? ''
  const quality = getRouterParam(event, 'quality') ?? ''
  if (!UUID.test(id) || !QUALITIES.has(quality)) throw createError({ statusCode: 404 })
  return proxyMedia(event, `/website/articles/${id}/video/${quality}`)
})
