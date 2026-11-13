<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()
const localePath = useLocalePath()
const notFound = computed(() => props.error.statusCode === 404)
useSeoMeta({ title: () => (notFound.value ? t('error.notFound') : t('error.unavailable')), robots: 'noindex' })
</script>

<template>
  <UApp>
    <NuxtLayout>
      <section class="container-site grid min-h-[60vh] place-items-center py-20 text-center">
        <div class="max-w-md space-y-4">
          <span class="mx-auto grid size-14 place-items-center rounded-xl bg-primary/10 text-primary">
            <UIcon :name="notFound ? 'i-lucide-search-x' : 'i-lucide-server-off'" class="size-7" />
          </span>
          <p class="text-5xl font-bold tracking-tight text-dimmed tabular-nums">{{ props.error.statusCode }}</p>
          <h1 class="text-2xl font-bold text-highlighted">{{ notFound ? t('error.notFound') : t('error.unavailable') }}</h1>
          <p class="text-muted">{{ notFound ? t('error.notFoundText') : t('error.unavailableText') }}</p>
          <UButton size="lg" icon="i-lucide-house" :label="t('error.home')" @click="clearError({ redirect: localePath('/') })" />
        </div>
      </section>
    </NuxtLayout>
  </UApp>
</template>
