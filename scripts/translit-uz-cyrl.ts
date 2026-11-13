// Writes i18n/locales/uz-cyrl.json from uz.json with the same rules the site uses for clinic texts.
// Run after editing uz.json: npm run gen:uz-cyrl
import { readFileSync, writeFileSync } from 'node:fs'
import { latinToCyrillic } from '../shared/utils/translit.ts'

type Tree = { [k: string]: string | Tree }
const walk = (o: Tree): Tree => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'string' ? latinToCyrillic(v) : walk(v)]))
const src = JSON.parse(readFileSync('i18n/locales/uz.json', 'utf8')) as Tree
writeFileSync('i18n/locales/uz-cyrl.json', JSON.stringify(walk(src), null, 2) + '\n')
console.log('i18n/locales/uz-cyrl.json written')
