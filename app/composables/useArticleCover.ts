import type { ArticleSummary } from '#shared/types'

/** Cover image URL through the site's own proxy; the version query busts caches after the cover changes. */
export function articleCover(a: ArticleSummary): string | null {
  return a.hasCover ? `/media/cover/${a.id}?v=${encodeURIComponent(a.updatedAt)}` : null
}

export function articleVideo(a: ArticleSummary): string | null {
  return a.hasVideo ? `/media/video/${a.id}?v=${encodeURIComponent(a.updatedAt)}` : null
}

/** 125 → "2:05" */
export function formatVideoDuration(sec: number | null | undefined): string {
  if (!sec) return ''
  return `${Math.floor(sec / 60)}:${String(Math.round(sec) % 60).padStart(2, '0')}`
}
