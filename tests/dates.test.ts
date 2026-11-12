import assert from 'node:assert/strict'
import { test } from 'node:test'
import { formatLongDate } from '../shared/utils/dates.ts'

test('formats in every language', () => {
  const iso = '2026-11-12T03:40:44.399Z'
  assert.equal(formatLongDate(iso, 'uz'), '12-noyabr, 2026')
  assert.equal(formatLongDate(iso, 'ru'), '12 ноября 2026')
  assert.equal(formatLongDate(iso, 'en'), '12 November 2026')
  assert.equal(formatLongDate(iso, 'tr'), '12 Kasım 2026')
})

test('uses Tashkent time (UTC+5) for the day', () => {
  assert.equal(formatLongDate('2026-12-31T19:30:00Z', 'en'), '1 January 2027')
  assert.equal(formatLongDate('2026-12-31T18:59:00Z', 'en'), '31 December 2026')
})

test('empty or invalid input', () => {
  assert.equal(formatLongDate(null, 'uz'), '')
  assert.equal(formatLongDate('nope', 'uz'), '')
  assert.equal(formatLongDate('2026-01-05T10:00:00Z', 'de'), '5-yanvar, 2026')
})
