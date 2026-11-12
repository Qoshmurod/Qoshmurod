<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { data: site } = useSite()
const menuOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => (menuOpen.value = false))

const links = computed(() => [
  { label: t('nav.home'), to: localePath('/') },
  { label: t('nav.about'), to: `${localePath('/')}#about`, hide: !site.value?.texts.about },
  { label: t('nav.news'), to: localePath('/news') },
  { label: t('nav.contacts'), to: `${localePath('/')}#contacts` },
].filter((l) => !l.hide))

const tel = computed(() => phoneHref(site.value?.phone))
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
    <div class="container-site flex h-16 items-center justify-between gap-4 sm:h-20">
      <NuxtLink :to="localePath('/')" class="min-w-0">
        <SiteLogo :name="site?.hospitalName ?? ''" :has-logo="!!site?.hasLogo" />
      </NuxtLink>

      <nav class="hidden items-center gap-1 lg:flex" aria-label="Main">
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-brand-50 hover:text-brand-800">
          {{ l.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <LangSwitcher />
        <a v-if="tel" :href="tel" class="btn-primary hidden !py-2.5 md:inline-flex">
          <AppIcon name="phone" class="size-4" />
          {{ site?.phone }}
        </a>
        <button type="button" class="grid size-10 place-items-center rounded-full text-slate-700 ring-1 ring-slate-200 lg:hidden" :aria-label="t('nav.menu')" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
          <AppIcon :name="menuOpen ? 'close' : 'menu'" class="size-5" />
        </button>
      </div>
    </div>

    <Transition enter-from-class="opacity-0 -translate-y-2" leave-to-class="opacity-0 -translate-y-2" enter-active-class="transition" leave-active-class="transition">
      <nav v-if="menuOpen" class="border-t border-slate-200 bg-white lg:hidden" aria-label="Mobile">
        <div class="container-site flex flex-col gap-1 py-3">
          <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="rounded-xl px-4 py-3 text-base font-semibold text-slate-700 hover:bg-brand-50">
            {{ l.label }}
          </NuxtLink>
          <a v-if="tel" :href="tel" class="btn-primary mt-2">
            <AppIcon name="phone" class="size-4" />
            {{ site?.phone }}
          </a>
        </div>
      </nav>
    </Transition>
  </header>
</template>
