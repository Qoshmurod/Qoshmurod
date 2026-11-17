import assert from 'node:assert/strict'
import { test } from 'node:test'
import { inlineImageNumbers, parseBlocks } from '../shared/utils/blocks.ts'

test('paragraphs, headings and lists', () => {
  const blocks = parseBlocks('## Yangi imkoniyat\n\nBirinchi qator\nikkinchi qator\n\n- Tez\n- Aniq\n\nOxiri')
  assert.deepEqual(blocks, [
    { type: 'heading', text: 'Yangi imkoniyat' },
    { type: 'paragraph', lines: ['Birinchi qator', 'ikkinchi qator'] },
    { type: 'list', items: ['Tez', 'Aniq'] },
    { type: 'paragraph', lines: ['Oxiri'] },
  ])
})

test('list right after a paragraph line, Windows newlines, bullets', () => {
  assert.deepEqual(parseBlocks('Kirish:\r\n• bir\r\n* ikki\r\nDavomi'), [
    { type: 'paragraph', lines: ['Kirish:'] },
    { type: 'list', items: ['bir', 'ikki'] },
    { type: 'paragraph', lines: ['Davomi'] },
  ])
})

test('empty input and empty markers', () => {
  assert.deepEqual(parseBlocks(''), [])
  assert.deepEqual(parseBlocks('##  \n\n-  \n\n'), [])
})

test('markup is kept as text', () => {
  assert.deepEqual(parseBlocks('<script>alert(1)</script>'), [{ type: 'paragraph', lines: ['<script>alert(1)</script>'] }])
})

test('a "[rasm N]" line shows gallery picture N there', () => {
  assert.deepEqual(parseBlocks('Kirish\n[rasm 2]\nDavomi\n\n[ RASM 1 ]\n\n[расм 3]\n[rasm 2] bilan matn'), [
    { type: 'paragraph', lines: ['Kirish'] },
    { type: 'image', n: 2 },
    { type: 'paragraph', lines: ['Davomi'] },
    { type: 'image', n: 1 },
    { type: 'image', n: 3 },
    { type: 'paragraph', lines: ['[rasm 2] bilan matn'] },
  ])
  assert.deepEqual([...inlineImageNumbers('[rasm 2]\nmatn\n[image 5]\n[rasm 2]')].sort(), [2, 5])
})
