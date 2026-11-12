import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mapUrl, phoneHref, socialHandle, socialUrl } from '../shared/utils/links.ts'

test('socialUrl accepts handles, host paths and URLs', () => {
  assert.equal(socialUrl('@shifomed', 't.me'), 'https://t.me/shifomed')
  assert.equal(socialUrl('shifomed', 'instagram.com'), 'https://instagram.com/shifomed')
  assert.equal(socialUrl('t.me/shifomed', 't.me'), 'https://t.me/shifomed')
  assert.equal(socialUrl('www.instagram.com/shifo.med/', 'instagram.com'), 'https://instagram.com/shifo.med')
  assert.equal(socialUrl('https://t.me/+abc', 't.me'), 'https://t.me/+abc')
  assert.equal(socialUrl('', 't.me'), null)
  assert.equal(socialUrl('bad handle!', 't.me'), null)
})

test('socialHandle', () => {
  assert.equal(socialHandle('https://t.me/shifomed'), '@shifomed')
  assert.equal(socialHandle(null), '')
})

test('phoneHref keeps digits and plus', () => {
  assert.equal(phoneHref('+998 71 200-00-00'), 'tel:+998712000000')
  assert.equal(phoneHref('12'), null)
  assert.equal(phoneHref(undefined), null)
})

test('mapUrl encodes the address', () => {
  assert.equal(mapUrl("Toshkent sh., Bunyodkor ko'chasi 1"), "https://www.google.com/maps/search/?api=1&query=Toshkent%20sh.%2C%20Bunyodkor%20ko'chasi%201")
  assert.equal(mapUrl('  '), null)
})
