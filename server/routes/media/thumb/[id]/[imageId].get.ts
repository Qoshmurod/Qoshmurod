/** Gallery picture preview (640 px), for the grid and news cards: /media/thumb/<article id>/<picture id> */
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id') ?? ''
  const imageId = getRouterParam(event, 'imageId') ?? ''
  if (!UUID.test(id) || !UUID.test(imageId)) throw createError({ statusCode: 404 })
  return proxyMedia(event, `/website/articles/${id}/images/${imageId}/thumb`)
})
