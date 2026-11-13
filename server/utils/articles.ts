import type { ArticleSummary, ContentLocale } from '#shared/types'

/**
 * All published articles of one language, newest first, kept for a minute.
 * A clinic publishes tens or hundreds of articles, so the site pages, searches and picks related articles
 * from this list instead of asking the Clinika API on every visit.
 */
export const publishedArticles = defineCachedFunction(
  async (locale: ContentLocale): Promise<ArticleSummary[]> => {
    const all: ArticleSummary[] = []
    for (let page = 1; page <= 50; page++) {
      const res = await backendGet<ArticleSummary[]>('/website/articles', { locale, page, limit: 100 })
      all.push(...res.data)
      if (!res.meta || page >= res.meta.totalPages) break
    }
    return all
  },
  { name: 'published-articles', maxAge: 60, swr: true, getKey: (locale: ContentLocale) => locale },
)
