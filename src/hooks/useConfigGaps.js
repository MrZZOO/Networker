import { useMemo } from 'react'
import { CONFIG, WATCHED_SLOTS } from '../config.js'

/* Which claims on this page are still unfilled.

   Only WATCHED_SLOTS are reported, not every null in CONFIG. Some nulls are
   load-bearing and correct — TOKEN_ADDRESS stays null until there IS a token — and
   flagging those on every run would train us to ignore the banner, which defeats
   the point of having one. */
function readPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj)
}

function isEmpty(value) {
  if (value == null) return true
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'string') return value.trim() === ''
  return false
}

export default function useConfigGaps() {
  return useMemo(
    () => WATCHED_SLOTS.filter((slot) => isEmpty(readPath(CONFIG, slot))),
    []
  )
}
