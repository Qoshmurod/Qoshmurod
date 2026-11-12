/**
 * Long date in the clinic's timezone (Asia/Tashkent, UTC+5, no DST), with our own month names:
 * browsers lack Uzbek month names in Intl, which would make server and browser render different text.
 */
const MONTHS: Record<string, string[]> = {
  uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
  ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
}

const TASHKENT_OFFSET_MS = 5 * 60 * 60 * 1000

export function formatLongDate(iso: string | null | undefined, locale: string): string {
  if (!iso) return ''
  const time = Date.parse(iso)
  if (Number.isNaN(time)) return ''
  const d = new Date(time + TASHKENT_OFFSET_MS)
  const day = d.getUTCDate()
  const year = d.getUTCFullYear()
  const month = (MONTHS[locale] ?? MONTHS.uz)[d.getUTCMonth()]
  return locale === 'uz' || !MONTHS[locale] ? `${day}-${month}, ${year}` : `${day} ${month} ${year}`
}
