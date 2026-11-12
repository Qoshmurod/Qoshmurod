import type { SiteInfo } from '#shared/types'

/** Clinic name, contacts and home texts for the current language (one request, shared by layout and pages). */
export function useSite() {
  const { locale } = useI18n()
  return useFetch<SiteInfo>('/api/info', {
    query: { locale },
    key: computed(() => `site-info-${locale.value}`),
    dedupe: 'defer',
  })
}

/** Long date in the current language (same text on server and browser, see shared/utils/dates.ts). */
export function useFormatDate() {
  const { locale } = useI18n()
  return (iso: string | null | undefined) => formatLongDate(iso, locale.value)
}
