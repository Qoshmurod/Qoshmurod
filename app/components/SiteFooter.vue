<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { data: site } = useSite()
const year = new Date().getFullYear()
const tel = computed(() => phoneHref(site.value?.phone))
const telegram = computed(() => socialUrl(site.value?.telegram, 't.me'))
const instagram = computed(() => socialUrl(site.value?.instagram, 'instagram.com'))
</script>

<template>
  <footer class="border-t border-default bg-muted">
    <div class="container-site grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
      <div class="space-y-3">
        <SiteLogo :name="site?.hospitalName ?? ''" :has-logo="!!site?.hasLogo" />
        <p v-if="site?.address" class="max-w-sm text-sm text-muted">{{ site.address }}</p>
      </div>
      <nav class="flex flex-col gap-2 text-sm" aria-label="Footer">
        <NuxtLink :to="localePath('/')" class="text-muted hover:text-primary">{{ t('nav.home') }}</NuxtLink>
        <NuxtLink :to="localePath('/news')" class="text-muted hover:text-primary">{{ t('nav.news') }}</NuxtLink>
        <NuxtLink :to="`${localePath('/')}#contacts`" class="text-muted hover:text-primary">{{ t('nav.contacts') }}</NuxtLink>
      </nav>
      <div class="flex flex-col gap-2 text-sm">
        <a v-if="tel" :href="tel" class="flex items-center gap-2 font-semibold text-highlighted hover:text-primary"><UIcon name="i-lucide-phone" class="size-4" />{{ site?.phone }}</a>
        <a v-if="telegram" :href="telegram" target="_blank" rel="noopener" class="flex items-center gap-2 text-muted hover:text-primary"><UIcon name="i-lucide-send" class="size-4" />Telegram</a>
        <a v-if="instagram" :href="instagram" target="_blank" rel="noopener" class="flex items-center gap-2 text-muted hover:text-primary"><UIcon name="i-lucide-instagram" class="size-4" />Instagram</a>
      </div>
    </div>
    <div class="border-t border-default">
      <p class="container-site py-5 text-xs text-dimmed">© {{ year }} {{ site?.hospitalName }}. {{ t('footer.rights') }}.</p>
    </div>
  </footer>
</template>
