<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { data: site } = useSite()
const menuOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => (menuOpen.value = false))

const links = computed(() => [
  { label: t('nav.home'), to: localePath('/'), icon: 'i-lucide-house' },
  { label: t('nav.about'), to: `${localePath('/')}#about`, icon: 'i-lucide-info', hide: !site.value?.texts.about },
  { label: t('nav.news'), to: localePath('/news'), icon: 'i-lucide-newspaper' },
  { label: t('nav.contacts'), to: `${localePath('/')}#contacts`, icon: 'i-lucide-phone' },
].filter((l) => !l.hide))

const tel = computed(() => phoneHref(site.value?.phone))
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-default bg-default/80 backdrop-blur">
    <div class="container-site flex h-16 items-center justify-between gap-4">
      <NuxtLink :to="localePath('/')" class="min-w-0">
        <SiteLogo :name="site?.hospitalName ?? ''" :has-logo="!!site?.hasLogo" />
      </NuxtLink>

      <nav class="hidden items-center gap-1 lg:flex" aria-label="Main">
        <UButton v-for="l in links" :key="l.to" :to="l.to" :label="l.label" color="neutral" variant="ghost" />
      </nav>

      <div class="flex items-center gap-1">
        <LangSwitcher />
        <UColorModeButton :aria-label="t('nav.theme')" />
        <UButton v-if="tel" :href="tel" icon="i-lucide-phone" :label="site?.phone" class="ms-1 hidden md:inline-flex" />
        <UButton
          class="lg:hidden"
          color="neutral"
          variant="ghost"
          :icon="menuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
          :aria-label="t('nav.menu')"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        />
      </div>
    </div>

    <nav v-if="menuOpen" class="border-t border-default bg-default lg:hidden" aria-label="Mobile">
      <div class="container-site flex flex-col gap-1 py-3">
        <UButton v-for="l in links" :key="l.to" :to="l.to" :label="l.label" :icon="l.icon" color="neutral" variant="ghost" size="lg" block class="justify-start" />
        <UButton v-if="tel" :href="tel" icon="i-lucide-phone" :label="site?.phone" size="lg" block class="mt-2" />
      </div>
    </nav>
  </header>
</template>
