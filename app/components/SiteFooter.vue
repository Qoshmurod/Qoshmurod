<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { data: site } = useSite()
const year = new Date().getFullYear()
const telegram = computed(() => socialUrl(site.value?.telegram, 't.me'))
const instagram = computed(() => socialUrl(site.value?.instagram, 'instagram.com'))
</script>

<template>
  <footer class="bg-slate-950 text-slate-400">
    <div class="container-site grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
      <div class="space-y-4">
        <SiteLogo :name="site?.hospitalName ?? ''" :has-logo="!!site?.hasLogo" light />
        <p v-if="site?.address" class="max-w-sm text-sm leading-relaxed">{{ site.address }}</p>
      </div>
      <nav class="flex flex-col gap-2 text-sm" aria-label="Footer">
        <NuxtLink :to="localePath('/')" class="hover:text-white">{{ t('nav.home') }}</NuxtLink>
        <NuxtLink :to="localePath('/news')" class="hover:text-white">{{ t('nav.news') }}</NuxtLink>
        <NuxtLink :to="`${localePath('/')}#contacts`" class="hover:text-white">{{ t('nav.contacts') }}</NuxtLink>
      </nav>
      <div class="flex flex-col gap-2 text-sm">
        <a v-if="phoneHref(site?.phone)" :href="phoneHref(site?.phone)!" class="font-semibold text-white hover:text-brand-300">{{ site?.phone }}</a>
        <a v-if="telegram" :href="telegram" target="_blank" rel="noopener" class="hover:text-white">Telegram</a>
        <a v-if="instagram" :href="instagram" target="_blank" rel="noopener" class="hover:text-white">Instagram</a>
      </div>
    </div>
    <div class="border-t border-white/10">
      <p class="container-site py-6 text-xs">© {{ year }} {{ site?.hospitalName }}. {{ t('footer.rights') }}.</p>
    </div>
  </footer>
</template>
