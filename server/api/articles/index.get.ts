import type { ArticlePage, ArticleSummary } from '#shared/types'

export default defineEventHandler(async (event): Promise<ArticlePage> => {
  const q = getQuery(event)
  const locale = localeOf(q.locale)
  const page = Math.max(1, Math.min(1000, Number.parseInt(String(q.page ?? '1'), 10) || 1))
  const limit = Math.max(1, Math.min(24, Number.parseInt(String(q.limit ?? '9'), 10) || 9))
  const res = await backendGet<ArticleSummary[]>('/website/articles', { locale, page, limit })
  return { items: res.data, meta: res.meta ?? { page, limit, total: res.data.length, totalPages: 1 } }
})
