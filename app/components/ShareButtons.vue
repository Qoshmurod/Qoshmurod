<script setup lang="ts">
/** Share an article: Telegram first (most used in Uzbekistan), then Facebook, WhatsApp and copy link. */
const props = defineProps<{ url: string; title: string }>()
const { t } = useI18n()
const toast = useToast()
const u = computed(() => encodeURIComponent(props.url))
const text = computed(() => encodeURIComponent(props.title))
const links = computed(() => [
  { label: 'Telegram', icon: 'i-lucide-send', href: `https://t.me/share/url?url=${u.value}&text=${text.value}` },
  { label: 'Facebook', icon: 'i-lucide-facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u.value}` },
  { label: 'WhatsApp', icon: 'i-lucide-message-circle', href: `https://wa.me/?text=${text.value}%20${u.value}` },
])

async function copy() {
  try {
    await navigator.clipboard.writeText(props.url)
    toast.add({ title: t('news.copied'), icon: 'i-lucide-check', color: 'success' })
  } catch {
    window.prompt(t('news.copyLink'), props.url)
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <span class="me-1 text-sm font-medium text-muted">{{ t('news.share') }}:</span>
    <UButton v-for="l in links" :key="l.label" :href="l.href" target="_blank" rel="noopener" color="neutral" variant="outline" size="sm" :icon="l.icon" :aria-label="l.label" :label="l.label" class="max-sm:[&>span:last-child]:hidden" />
    <UButton color="neutral" variant="outline" size="sm" icon="i-lucide-link" :label="t('news.copyLink')" class="max-sm:[&>span:last-child]:hidden" :aria-label="t('news.copyLink')" @click="copy" />
  </div>
</template>
