/** "@clinic", "clinic", "t.me/clinic" or a full URL → https link; empty → null. */
export function socialUrl(value: string | null | undefined, host: 't.me' | 'instagram.com'): string | null {
  const v = (value ?? '').trim()
  if (!v) return null
  if (/^https?:\/\//i.test(v)) return v
  const withoutHost = v.replace(new RegExp(`^(www\\.)?${host.replace('.', '\\.')}/`, 'i'), '')
  const handle = withoutHost.replace(/^@/, '').replace(/[/?#].*$/, '')
  return /^[A-Za-z0-9_.]{2,64}$/.test(handle) ? `https://${host}/${handle}` : null
}

/** Visible handle for a social link: "@clinic". */
export function socialHandle(url: string | null): string {
  if (!url) return ''
  const last = url.replace(/\/+$/, '').split('/').pop() ?? ''
  return last ? `@${last}` : url
}

/** "+998 71 200-00-00" → "tel:+998712000000". */
export function phoneHref(phone: string | null | undefined): string | null {
  const digits = (phone ?? '').replace(/[^\d+]/g, '')
  return digits.replace(/\+/g, '').length >= 5 ? `tel:${digits}` : null
}

export function mapUrl(address: string | null | undefined): string | null {
  const a = (address ?? '').trim()
  return a ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a)}` : null
}
