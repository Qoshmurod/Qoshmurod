import type { ArticleFull } from '#shared/types'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  if (!SLUG.test(slug)) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  const res = await backendGet<ArticleFull>(`/website/articles/by-slug/${slug}`)
  return localeOf(getQuery(event).locale) === 'uz-cyrl' && res.data.locale === 'uz' ? cyrillicArticle(res.data) : res.data
})
