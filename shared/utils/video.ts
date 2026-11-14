/**
 * Starting quality for this screen, like YouTube's "Auto" at load: the smallest quality that still fills the player
 * on this display (CSS width × pixel ratio), at most 1080p, and 480p on slow or data-saving connections.
 * The viewer can switch to any quality (up to 4K) in the player menu.
 */
export function pickStartQuality(
  qualities: number[],
  player: { width: number; pixelRatio: number; videoWidth: number; videoHeight: number },
  connection?: { saveData?: boolean; effectiveType?: string },
): number | undefined {
  const sorted = [...qualities].sort((a, b) => a - b)
  if (!sorted.length) return undefined
  const slow = !!connection?.saveData || /(^|-)2g$|^3g$/.test(connection?.effectiveType ?? '')
  const cap = slow ? 480 : 1080
  // Pixels of the video's short side that the player shows on screen
  const landscape = player.videoWidth >= player.videoHeight
  const shown = landscape ? (player.width * player.pixelRatio * player.videoHeight) / player.videoWidth : player.width * player.pixelRatio
  const need = Math.min(cap, shown)
  const fitting = sorted.filter((q) => q <= cap)
  return fitting.find((q) => q >= need) ?? fitting[fitting.length - 1] ?? sorted[0]
}
