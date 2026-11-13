import { test } from 'node:test'
import assert from 'node:assert/strict'
import { matchesSearch, normalizeForSearch, readingMinutes } from '../shared/utils/search.ts'

test('Cyrillic, apostrophes and case are compared as one form', () => {
  assert.equal(normalizeForSearch('Соғлиқ'), "sog'liq")
  assert.equal(normalizeForSearch('SOG‘LIQ'), "sog'liq")
  assert.ok(matchesSearch('грипп', ['Grippdan qanday saqlanish mumkin']))
  assert.ok(matchesSearch('MRT apparat', ['Yangi MRT apparati ishga tushdi']))
  assert.ok(matchesSearch('qo‘llarni', ["Qo'llarni tez-tez yuving"]))
  assert.ok(!matchesSearch('yurak gripp', ['Yurak salomatligi']))
  assert.ok(matchesSearch('  ', ['anything']))
})

test('reading time', () => {
  assert.equal(readingMinutes(''), 1)
  assert.equal(readingMinutes('so‘z '.repeat(1000)), 5)
})
