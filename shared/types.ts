export const SITE_LOCALES = ['uz', 'uz-cyrl', 'ru', 'en', 'tr'] as const
export type SiteLocale = (typeof SITE_LOCALES)[number]
/** Languages the Clinika API stores content in; uz-cyrl is served from uz and transliterated by this site. */
export type ContentLocale = Exclude<SiteLocale, 'uz-cyrl'>

export interface SiteInfo {
  hospitalName: string
  hasLogo: boolean
  phone: string
  address: string
  workingHours: { start: string; end: string }
  telegram: string
  instagram: string
  texts: { heroTitle: string; heroText: string; about: string }
}

export interface ArticleSummary {
  id: string
  slug: string
  locale: SiteLocale
  title: string
  excerpt: string | null
  hasCover: boolean
  publishedAt: string | null
  updatedAt: string
}

export interface ArticleFull extends ArticleSummary {
  content: string
}

export interface PageMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ArticlePage {
  items: ArticleSummary[]
  meta: PageMeta
}
