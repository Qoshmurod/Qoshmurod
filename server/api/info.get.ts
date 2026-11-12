import type { SiteInfo } from '#shared/types'

export default defineEventHandler(async (event) => {
  const locale = localeOf(getQuery(event).locale)
  const res = await backendGet<SiteInfo>('/website/info', { locale })
  return res.data
})
