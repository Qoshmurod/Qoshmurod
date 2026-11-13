import type { ArticlePage } from '#shared/types'

/** ?locale, ?page, ?limit, ?q (search in title and excerpt), ?exclude (slug, for "related articles"). */
export default defineEventHandler(async (event): Promise<ArticlePage> => {
  const q = getQuery(event)
  const locale = localeOf(q.locale)
  const page = Math.max(1, Math.min(1000, Number.parseInt(String(q.page ?? '1'), 10) || 1))
  const limit = Math.max(1, Math.min(24, Number.parseInt(String(q.limit ?? '9'), 10) || 9))
  const search = String(q.q ?? '').slice(0, 100)
  const exclude = String(q.exclude ?? '')

  let items = await publishedArticles(contentLocale(locale))
  if (locale === 'uz-cyrl') items = items.map(cyrillicArticle)
  if (exclude) items = items.filter((a) => a.slug !== exclude)
  if (search.trim()) items = items.filter((a) => matchesSearch(search, [a.title, a.excerpt]))

  const total = items.length
  return {
    items: items.slice((page - 1) * limit, page * limit),
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  }
})
