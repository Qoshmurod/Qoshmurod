import type { H3Event } from 'h3'
import type { PageMeta, SiteLocale } from '#shared/types'
import { SITE_LOCALES } from '#shared/types'

interface Envelope<T> {
  success: boolean
  data: T
  meta?: PageMeta
}

/** GET from the Clinika API; its `{ success, data, meta }` envelope is unwrapped. 404 stays 404, anything else → 502. */
export async function backendGet<T>(path: string, query?: Record<string, string | number>): Promise<Envelope<T>> {
  const { backendUrl } = useRuntimeConfig()
  try {
    return await $fetch<Envelope<T>>(path, { baseURL: backendUrl, query, timeout: 8000, retry: 1 })
  } catch (error) {
    const status = (error as { response?: { status?: number } }).response?.status
    if (status === 404) throw createError({ statusCode: 404, statusMessage: 'Not found' })
    console.error(`[backend] GET ${path} failed:`, (error as Error).message)
    throw createError({ statusCode: 502, statusMessage: 'Clinic service unavailable' })
  }
}

/** Streams an image from the Clinika API with its type and cache headers. */
export async function backendImage(event: H3Event, path: string): Promise<Buffer> {
  const { backendUrl } = useRuntimeConfig()
  try {
    const res = await $fetch.raw<ArrayBuffer>(path, { baseURL: backendUrl, responseType: 'arrayBuffer', timeout: 8000 })
    const type = res.headers.get('content-type') ?? ''
    if (!/^image\/(png|jpeg|webp)$/.test(type)) throw createError({ statusCode: 404 })
    setResponseHeaders(event, {
      'Content-Type': type,
      'Cache-Control': res.headers.get('cache-control') ?? 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    })
    return Buffer.from(res._data ?? new ArrayBuffer(0))
  } catch (error) {
    const status = (error as { response?: { status?: number }; statusCode?: number }).response?.status ?? (error as { statusCode?: number }).statusCode
    throw createError({ statusCode: status === 404 ? 404 : 502 })
  }
}

export function localeOf(value: unknown): SiteLocale {
  return SITE_LOCALES.includes(value as SiteLocale) ? (value as SiteLocale) : 'uz'
}

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/
