/* ─── Formatting helpers ─────────────────────────────────────────────────────
   Every function here returns null when it has nothing true to say. Callers then
   render nothing at all — never a dash, never a zero, never "N/A". */

import { CONFIG } from '../config.js'

/* A fee, as it appears on a card.

   Three outcomes, matching the render contract:
     0             → { free: true }            the caller renders a "FREE" pill
     n + a ticker  → "250 NTWK"
     n, no ticker  → "250" with the caller's own unit-less label, because inventing
                     a ticker before one exists would be a fake. */
export function formatFee(amount, token = CONFIG.TOKEN_SYMBOL) {
  if (amount === 0) return { free: true, text: 'Free' }
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0) return null

  const decimals = CONFIG.TOKEN_DECIMALS
  const value = typeof decimals === 'number' ? amount / 10 ** decimals : amount
  const text = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: typeof decimals === 'number' ? 2 : 0,
  }).format(value)

  return { free: false, text: token ? `${text} ${token}` : text }
}

/* A response window, in the plainest words that are still accurate. */
export function formatWindow(hours) {
  if (typeof hours !== 'number' || !Number.isFinite(hours) || hours <= 0) return null
  if (hours < 24) return `${Math.round(hours)}h`
  const days = Math.round(hours / 24)
  return days === 1 ? '1 day' : `${days} days`
}

/* Relative time, past only. Null in, null out. */
export function timeAgo(iso) {
  if (!iso) return null
  const then = new Date(iso).getTime()
  if (!Number.isFinite(then)) return null

  const seconds = Math.floor((Date.now() - then) / 1000)
  if (seconds < 60) return 'just now'

  const steps = [
    [31536000, 'y'],
    [2592000, 'mo'],
    [604800, 'w'],
    [86400, 'd'],
    [3600, 'h'],
    [60, 'm'],
  ]
  for (const [secs, unit] of steps) {
    if (seconds >= secs) return `${Math.floor(seconds / secs)}${unit} ago`
  }
  return 'just now'
}

/* A percentage that refuses to render when it isn't real. A backend that has counted
   zero requests has no rate to report — that is null, not 0%. */
export function formatPct(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null
  return `${Math.round(value)}%`
}

/* Initials for the avatar fallback. Never a stock face. */
export function initials(name) {
  if (!name || typeof name !== 'string') return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/* Trim a long handle for narrow cards without losing which service it is. */
export function shortHandle(handle, max = 18) {
  if (!handle) return null
  return handle.length <= max ? handle : `${handle.slice(0, max - 1)}…`
}
