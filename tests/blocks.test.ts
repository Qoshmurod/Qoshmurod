import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseBlocks } from '../shared/utils/blocks.ts'

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
