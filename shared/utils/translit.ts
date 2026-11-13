/**
 * Uzbek Latin → Cyrillic, with the same rules as the Clinika staff app (frontend/scripts/translit-uz-cyrl.mjs there).
 * The clinic writes site texts and articles once, in Latin; the /uz-cyrl version of the site shows them in Cyrillic.
 */

// Kept verbatim (brands, codes, units). Whole words, case-sensitive.
const PROTECTED = new Set(['Excel', 'PDF', 'QR', 'UZS', 'ID', 'E-mail', 'Email', 'Wi-Fi'])
// Whole-word exceptions where a digraph rule would fire across a morpheme boundary (-yat|-siz, Ob|yekt).
const EXCEPTIONS: Record<string, string> = {
  Muvaffaqiyatsiz: 'Муваффақиятсиз', muvaffaqiyatsiz: 'муваффақиятсиз',
  Obyekt: 'Объект', obyekt: 'объект',
}
// Digraphs & apostrophes first (order matters), then single letters.
const RULES: [RegExp, string][] = [
  [/O[‘'ʻ’]/g, 'Ў'], [/o[‘'ʻ’]/g, 'ў'],
  [/G[‘'ʻ’]/g, 'Ғ'], [/g[‘'ʻ’]/g, 'ғ'],
  [/SH/g, 'Ш'], [/Sh/g, 'Ш'], [/sh/g, 'ш'],
  [/CH/g, 'Ч'], [/Ch/g, 'Ч'], [/ch/g, 'ч'],
  [/YO/g, 'Ё'], [/Yo/g, 'Ё'], [/yo/g, 'ё'],
  [/YU/g, 'Ю'], [/Yu/g, 'Ю'], [/yu/g, 'ю'],
  [/YA/g, 'Я'], [/Ya/g, 'Я'], [/ya/g, 'я'],
  [/YE/g, 'Е'], [/Ye/g, 'Е'], [/ye/g, 'е'],
  [/TS/g, 'Ц'], [/Ts/g, 'Ц'], [/ts/g, 'ц'],
  [/^E/u, 'Э'], [/^e/u, 'э'], // word-initial e → э
  [/[’'ʼ‘]/g, 'ъ'], // tutuq belgisi (ma'lumot → маълумот)
]
const LETTERS: Record<string, string> = {
  A: 'А', B: 'Б', D: 'Д', E: 'Е', F: 'Ф', G: 'Г', H: 'Ҳ', I: 'И', J: 'Ж', K: 'К', L: 'Л', M: 'М', N: 'Н', O: 'О', P: 'П', Q: 'Қ', R: 'Р', S: 'С', T: 'Т', U: 'У', V: 'В', X: 'Х', Y: 'Й', Z: 'З',
  a: 'а', b: 'б', d: 'д', e: 'е', f: 'ф', g: 'г', h: 'ҳ', i: 'и', j: 'ж', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', q: 'қ', r: 'р', s: 'с', t: 'т', u: 'у', v: 'в', x: 'х', y: 'й', z: 'з',
}

function word(w: string): string {
  if (PROTECTED.has(w) || /^[A-Z]{1,2}$/.test(w)) return w // 1–2 Latin capitals are codes
  const exception = EXCEPTIONS[w]
  if (exception) return exception
  // Suffix after a foreign name is written without the apostrophe in Cyrillic: Telegram’da → Телеграмда
  let s = w.replace(/^(Telegram|Instagram|WhatsApp|Facebook)[’'ʻʼ‘]/u, '$1')
  for (const [re, to] of RULES) s = s.replace(re, to)
  return s.replace(/[A-Za-z]/g, (ch) => LETTERS[ch] ?? ch)
}

/** Transliterates running text word by word; links, e-mails, @handles and {placeholders} stay as they are. */
export function latinToCyrillic(text: string): string {
  return text.replace(
    /(https?:\/\/\S+|www\.\S+|\S+@\S+\.\S+|@\w+|\{\w+\})|([\p{L}][\p{L}’'ʻʼ‘]*(?:[.-][\p{L}]+)*)/gu,
    (m, keep: string | undefined, w: string | undefined) => (keep ? keep : word(w ?? m)),
  )
}
