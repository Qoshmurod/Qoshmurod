export default defineEventHandler((event) => {
  const site = useRuntimeConfig().public.siteUrl.replace(/\/+$/, '')
  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site}/sitemap.xml\n`
})
