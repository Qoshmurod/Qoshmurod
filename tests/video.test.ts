import { test } from 'node:test'
import assert from 'node:assert/strict'
import { pickStartQuality } from '../shared/utils/video.ts'

const all = [2160, 1440, 1080, 720, 480, 360]
const wide = { videoWidth: 3840, videoHeight: 2160 }

test('fits the start quality to the screen, never above 1080p', () => {
  assert.equal(pickStartQuality(all, { width: 390, pixelRatio: 3, ...wide }), 720) // phone: 1170 px wide → 658 px tall
  assert.equal(pickStartQuality(all, { width: 704, pixelRatio: 1, ...wide }), 480) // laptop article column
  assert.equal(pickStartQuality(all, { width: 704, pixelRatio: 2, ...wide }), 1080) // retina laptop: 792 px tall
  assert.equal(pickStartQuality(all, { width: 2560, pixelRatio: 2, ...wide }), 1080) // fullscreen 4K monitor: still 1080 to start
})

test('vertical videos use the short side', () => {
  assert.equal(pickStartQuality([1080, 720, 480, 360], { width: 390, pixelRatio: 3, videoWidth: 1080, videoHeight: 1920 }), 1080)
  assert.equal(pickStartQuality([1080, 720, 480, 360], { width: 300, pixelRatio: 1, videoWidth: 1080, videoHeight: 1920 }), 360)
})

test('slow or data-saving connections start at 480p at most', () => {
  assert.equal(pickStartQuality(all, { width: 390, pixelRatio: 3, ...wide }, { effectiveType: '3g' }), 480)
  assert.equal(pickStartQuality(all, { width: 390, pixelRatio: 3, ...wide }, { saveData: true }), 480)
  assert.equal(pickStartQuality([720], { width: 390, pixelRatio: 3, ...wide }, { effectiveType: 'slow-2g' }), 720)
})
