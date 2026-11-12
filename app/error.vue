<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()
const localePath = useLocalePath()
const notFound = computed(() => props.error.statusCode === 404)
useSeoMeta({ title: () => (notFound.value ? t('error.notFound') : t('error.unavailable')), robots: 'noindex' })
</script>

<template>
  <NuxtLayout>
    <section class="container-site grid min-h-[60vh] place-items-center py-24 text-center">
      <div class="max-w-md space-y-5">
        <p class="text-7xl font-extrabold tracking-tight text-brand-200">{{ props.error.statusCode }}</p>
        <h1 class="text-3xl font-extrabold text-slate-900">{{ notFound ? t('error.notFound') : t('error.unavailable') }}</h1>
        <p class="text-slate-600">{{ notFound ? t('error.notFoundText') : t('error.unavailableText') }}</p>
        <button type="button" class="btn-primary" @click="clearError({ redirect: localePath('/') })">{{ t('error.home') }}</button>
      </div>
    </section>
  </NuxtLayout>
</template>
