<script setup lang="ts">
import type { ArticleImage } from '#shared/types'

/**
 * Full-screen picture viewer: arrows / swipe to go through the article's pictures, Esc or a tap outside to close.
 * Opened with v-model:index (null = closed).
 */
const props = defineProps<{ articleId: string; images: ArticleImage[] }>()
const index = defineModel<number | null>('index', { default: null })
const { t } = useI18n()

const current = computed(() => (index.value === null ? null : props.images[index.value] ?? null))
const closeBtn = ref<HTMLButtonElement | null>(null)

function go(by: number) {
  if (index.value === null || !props.images.length) return
  index.value = (index.value + by + props.images.length) % props.images.length
}
function close() {
  index.value = null
}

function onKey(e: KeyboardEvent) {
  if (index.value === null) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') go(1)
  else if (e.key === 'ArrowLeft') go(-1)
}

// Swipe left / right on touch screens
let startX: number | null = null
function onPointerDown(e: PointerEvent) {
  startX = e.clientX
}
function onPointerUp(e: PointerEvent) {
  if (startX === null) return
  const dx = e.clientX - startX
  startX = null
  if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
}

watch(index, async (v, old) => {
  if (!import.meta.client) return
  document.documentElement.style.overflow = v === null ? '' : 'hidden'
  if (v !== null && old === null) {
    await nextTick()
    closeBtn.value?.focus()
  }
  // Load the neighbours ahead, so the next picture shows at once
  if (v !== null && props.images.length > 1) {
    for (const n of [v + 1, v - 1]) {
      const img = props.images[(n + props.images.length) % props.images.length]
      if (img) new Image().src = imageUrl(props.articleId, img.id)
    }
  }
})
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="current"
      class="fixed inset-0 z-[60] flex flex-col bg-black text-white"
      role="dialog"
      aria-modal="true"
      :aria-label="current.caption || t('gallery.picture', { n: (index ?? 0) + 1 })"
      @click.self="close"
    >
      <div class="flex items-center justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <span class="text-sm text-white/70 tabular-nums">{{ (index ?? 0) + 1 }} / {{ images.length }}</span>
        <button
          ref="closeBtn"
          type="button"
          class="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
          :aria-label="t('gallery.close')"
          @click="close"
        >
          <UIcon name="i-lucide-x" class="size-6" />
        </button>
      </div>

      <div class="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-2 sm:px-16" @click.self="close" @pointerdown="onPointerDown" @pointerup="onPointerUp">
        <img
          :key="current.id"
          :src="imageUrl(articleId, current.id)"
          :alt="current.caption"
          :width="current.width"
          :height="current.height"
          class="max-h-full max-w-full select-none object-contain"
          draggable="false"
        >
        <template v-if="images.length > 1">
          <button
            type="button"
            class="absolute top-1/2 left-2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:grid"
            :aria-label="t('gallery.prev')"
            @click="go(-1)"
          >
            <UIcon name="i-lucide-chevron-left" class="size-7" />
          </button>
          <button
            type="button"
            class="absolute top-1/2 right-2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:grid"
            :aria-label="t('gallery.next')"
            @click="go(1)"
          >
            <UIcon name="i-lucide-chevron-right" class="size-7" />
          </button>
        </template>
      </div>

      <div class="min-h-14 px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] text-center">
        <p v-if="current.caption" class="mx-auto max-w-2xl text-sm text-white/85">{{ current.caption }}</p>
        <p v-if="images.length > 1" class="mt-1 text-xs text-white/50 sm:hidden">{{ t('gallery.swipe') }}</p>
      </div>
    </div>
  </Teleport>
</template>
