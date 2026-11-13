import type { SiteInfo } from '#shared/types'

export default defineEventHandler(async (event) => {
  const locale = localeOf(getQuery(event).locale)
  const res = await backendGet<SiteInfo>('/website/info', { locale: contentLocale(locale) })
  if (locale !== 'uz-cyrl') return res.data
  // Clinic name, phone and social handles stay as written in Settings; the address and site texts go to Cyrillic.
  const info = res.data
  return {
    ...info,
    address: latinToCyrillic(info.address),
    texts: {
      heroTitle: latinToCyrillic(info.texts.heroTitle),
      heroText: latinToCyrillic(info.texts.heroText),
      about: latinToCyrillic(info.texts.about),
    },
  } satisfies SiteInfo
})
