import { SITE_LOCALES, type SiteLocale } from '#shared/types'

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c] as string)

/** RSS of the latest 30 articles of one language: /feed/uz.xml, /feed/ru.xml … (Telegram bots and news readers use it). */
export default defineEventHandler(async (event) => {
  const locale = (getRouterParam(event, 'locale.xml') ?? getRouterParam(event, 'locale') ?? '').replace(/\.xml$/, '') as SiteLocale
  if (!SITE_LOCALES.includes(locale)) throw createError({ statusCode: 404 })
  const site = useRuntimeConfig().public.siteUrl.replace(/\/+$/, '')
  const prefix = locale === 'uz' ? '' : `/${locale}`
  const [infoRes, list] = await Promise.all([
    backendGet<{ hospitalName: string }>('/website/info', { locale: contentLocale(locale) }),
    publishedArticles(contentLocale(locale)),
  ])
  const items = (locale === 'uz-cyrl' ? list.map(cyrillicArticle) : list).slice(0, 30)
  const name = infoRes.data.hospitalName
  const body = items
    .map((a) => {
      const link = `${site}${prefix}/news/${a.slug}`
      const date = a.publishedAt ? `<pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>` : ''
      const cover = a.hasCover ? `<enclosure url="${esc(`${site}/media/cover/${a.id}`)}" type="image/jpeg" length="0"/>` : ''
      return `    <item><title>${esc(a.title)}</title><link>${esc(link)}</link><guid isPermaLink="true">${esc(link)}</guid>${date}${a.excerpt ? `<description>${esc(a.excerpt)}</description>` : ''}${cover}</item>`
    })
    .join('\n')
  setResponseHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=600')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(name)}</title>
    <link>${esc(`${site}${prefix}/news`)}</link>
    <description>${esc(name)}</description>
    <language>${locale === 'uz-cyrl' ? 'uz-Cyrl' : locale}</language>
    <atom:link href="${esc(`${site}/feed/${locale}.xml`)}" rel="self" type="application/rss+xml"/>
${body}
  </channel>
</rss>
`
})
