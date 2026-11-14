<script setup lang="ts">
import 'plyr/dist/plyr.css'

/**
 * Article video with a YouTube-style menu: quality (360p … 4K, as made by Clinika), speed, fullscreen and
 * picture-in-picture; touch-friendly on phones. Before the script loads it is a plain <video> that already plays.
 */
const props = defineProps<{
  id: string
  qualities: number[]
  width: number | null | undefined
  height: number | null | undefined
  poster: string | null
  title: string
  version: string
}>()
const { t } = useI18n()

const w = computed(() => props.width || 16)
const h = computed(() => props.height || 9)
const vertical = computed(() => h.value > w.value)
const src = (q: number) => `/media/video/${props.id}/${q}?v=${encodeURIComponent(props.version)}`
// Server render: the medium quality first, so a browser without the script starts with something reasonable
const startGuess = computed(() => props.qualities.find((q) => q <= 720) ?? props.qualities[props.qualities.length - 1])
const ordered = computed(() => [startGuess.value, ...props.qualities.filter((q) => q !== startGuess.value)].filter((q): q is number => !!q))

const frame = ref<HTMLElement | null>(null)
const video = ref<HTMLVideoElement | null>(null)
let player: { destroy: () => void } | null = null

onMounted(async () => {
  if (!video.value || !frame.value) return
  const { default: Plyr } = await import('plyr')
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  const start = pickStartQuality(
    props.qualities,
    { width: frame.value.clientWidth, pixelRatio: window.devicePixelRatio || 1, videoWidth: w.value, videoHeight: h.value },
    connection,
  )
  player = new Plyr(video.value, {
    controls: ['play-large', 'play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'settings', 'pip', 'airplay', 'fullscreen'],
    settings: ['quality', 'speed'],
    quality: { default: start ?? 720, options: [...props.qualities] },
    speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
    ratio: `${w.value}:${h.value}`,
    fullscreen: { enabled: true, fallback: true, iosNative: true },
    storage: { enabled: false },
    // Icons and the blank clip from this site, not Plyr's CDN (no third-party requests from visitors)
    iconUrl: '/plyr.svg',
    blankVideo: '/plyr-blank.mp4',
    tooltips: { controls: true, seek: true },
    i18n: {
      restart: t('player.restart'),
      rewind: t('player.rewind'),
      play: t('player.play'),
      pause: t('player.pause'),
      fastForward: t('player.forward'),
      seek: t('player.seek'),
      seekLabel: '{currentTime} / {duration}',
      played: t('player.played'),
      buffered: t('player.buffered'),
      currentTime: t('player.currentTime'),
      duration: t('player.duration'),
      volume: t('player.volume'),
      mute: t('player.mute'),
      unmute: t('player.unmute'),
      enterFullscreen: t('player.fullscreen'),
      exitFullscreen: t('player.exitFullscreen'),
      settings: t('player.settings'),
      menuBack: t('player.back'),
      speed: t('player.speed'),
      normal: t('player.normal'),
      quality: t('player.quality'),
      pip: t('player.pip'),
      qualityBadge: { 2160: '4K', 1440: '2K', 1080: 'HD', 720: 'HD' },
    },
  })
})
onBeforeUnmount(() => player?.destroy())
</script>

<template>
  <div
    ref="frame"
    class="video-frame mx-auto overflow-hidden rounded-xl bg-black ring-1 ring-default"
    :class="vertical ? 'vertical' : 'w-full'"
    :style="{ '--ratio': `${w} / ${h}`, '--rw': w, '--rh': h }"
  >
    <video
      ref="video"
      controls
      playsinline
      preload="metadata"
      :poster="props.poster ?? undefined"
      :aria-label="props.title"
      :data-poster="props.poster ?? undefined"
      class="size-full"
    >
      <source v-for="q in ordered" :key="q" :src="src(q)" type="video/mp4" :size="q">
    </video>
  </div>
</template>

<style scoped>
.video-frame {
  aspect-ratio: var(--ratio);
  max-width: 100%;
  --plyr-color-main: var(--ui-primary);
  --plyr-video-background: #000;
  --plyr-menu-radius: 10px;
  --plyr-control-radius: 8px;
}
/* Vertical phone videos: as tall as fits the screen (80% of it, at most 720px), centred, never wider than the column */
.video-frame.vertical {
  width: min(100%, calc(min(80svh, 720px) * var(--rw) / var(--rh)));
}
.video-frame :deep(.plyr) {
  height: 100%;
}
</style>
