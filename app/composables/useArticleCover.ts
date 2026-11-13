import type { ArticleSummary } from '#shared/types'

/** Cover image URL through the site's own proxy; the version query busts caches after the cover changes. */
export function articleCover(a: ArticleSummary): string | null {
  return a.hasCover ? `/media/cover/${a.id}?v=${encodeURIComponent(a.updatedAt)}` : null
}
