export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id') ?? ''
  if (!UUID.test(id)) throw createError({ statusCode: 404 })
  return backendImage(event, `/website/articles/${id}/cover`)
})
