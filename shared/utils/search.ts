/**
 * Search helpers for the news page. The clinic writes Uzbek in Latin; a reader may type Cyrillic,
 * any apostrophe variant or other letter case — all of them are brought to one form before comparing.
 */
const CYR: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', ғ: "g'", д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'y', к: 'k', қ: 'q', л: 'l', м: 'm',
  н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ў: "o'", ф: 'f', х: 'x', ҳ: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sh',
  ъ: "'", ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya',
}

export function normalizeForSearch(text: string): string {
  return text
    .toLowerCase()
    .replace(/[а-яёғқўҳ]/g, (ch) => CYR[ch] ?? ch)
    .replace(/[‘’ʻʼ`´]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/** Every word of the query is found somewhere in the fields. */
export function matchesSearch(query: string, fields: (string | null | undefined)[]): boolean {
  const words = normalizeForSearch(query).split(' ').filter(Boolean)
  if (!words.length) return true
  const haystack = normalizeForSearch(fields.filter(Boolean).join(' '))
  return words.every((w) => haystack.includes(w))
}

/** Minutes to read at ~200 words per minute, at least 1. */
export function readingMinutes(text: string | null | undefined): number {
  const words = (text ?? '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
