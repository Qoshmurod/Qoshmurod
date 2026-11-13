import { test } from 'node:test'
import assert from 'node:assert/strict'
import { latinToCyrillic } from '../shared/utils/translit.ts'

test('same results as the Clinika app transliteration self-test', () => {
  const cases: Record<string, string> = {
    Muvaffaqiyatsiz: 'Муваффақиятсиз',
    Obyekt: 'Объект',
    Autentifikatsiya: 'Аутентификация',
    'Bo‘limlar': 'Бўлимлар',
    'Ma’lumot': 'Маълумот',
    'E’lon': 'Эълон',
    'yo‘q': 'йўқ',
    Yangi: 'Янги',
  }
  for (const [latin, cyr] of Object.entries(cases)) assert.equal(latinToCyrillic(latin), cyr)
})

test('sentences, links and handles', () => {
  assert.equal(latinToCyrillic('Sog‘lig‘ingiz — bizning g‘amxo‘rligimiz'), 'Соғлиғингиз — бизнинг ғамхўрлигимиз')
  assert.equal(latinToCyrillic('Telegram’da yozish'), 'Телеграмда ёзиш')
  assert.equal(latinToCyrillic('Yangi MRT apparati'), 'Янги МРТ аппарати')
  assert.equal(latinToCyrillic('Batafsil: https://t.me/shifo @shifo_klinika'), 'Батафсил: https://t.me/shifo @shifo_klinika')
  assert.equal(latinToCyrillic('## Asosiy tavsiyalar\n- Qo‘llarni yuving'), '## Асосий тавсиялар\n- Қўлларни ювинг')
})
