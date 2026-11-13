import type { ArticleSummary } from '#shared/types'
import { SITE_LOCALES } from '#shared/types'

const escapeXml = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c] as string)

/** Home + news list per language, and every published article. */
export default defineEventHandler(async (event) => {
  const site = useRuntimeConfig().public.siteUrl.replace(/\/+$/, '')
  const prefix = (locale: string) => (locale === 'uz' ? '' : `/${locale}`)
  const urls: { loc: string; lastmod?: string }[] = []
  for (const locale of SITE_LOCALES) {
    urls.push({ loc: `${site}${prefix(locale)}/` }, { loc: `${site}${prefix(locale)}/news` })
    for (let page = 1; page <= 20; page++) {
      const res = await backendGet<ArticleSummary[]>('/website/articles', { locale: contentLocale(locale), page, limit: 100 }).catch(() => null)
      if (!res) break
      for (const a of res.data) urls.push({ loc: `${site}${prefix(locale)}/news/${a.slug}`, lastmod: a.updatedAt })
      if (!res.meta || page >= res.meta.totalPages) break
    }
  }
  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600')
  const body = urls
    .map((u) => `  <url><loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''}</url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
})
