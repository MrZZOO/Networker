/* Submitting a listing application.

   BACKEND-AGNOSTIC BY DESIGN. Two supported targets, picked by which env vars are
   set, because the backend decision was still open when this was written and the
   form should not have to be rewritten when it lands:

     VITE_API_URL          → our own service: POST {url}/v1/applications
     VITE_SUPABASE_URL +   → Supabase PostgREST: POST {url}/rest/v1/applications
     VITE_SUPABASE_ANON_KEY

   VITE_API_URL wins if both are set. Neither set → submissions are off, and the
   form says so plainly rather than swallowing what someone typed.

   Plain fetch rather than @supabase/supabase-js: this is a single INSERT and the
   SDK is not worth ~100KB of bundle for it. It is also what makes the two targets
   interchangeable — an SDK would have welded the form to one vendor. */

const API_URL = import.meta.env.VITE_API_URL ?? null
const SB_URL = import.meta.env.VITE_SUPABASE_URL ?? null
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? null

export function submissionTarget() {
  if (API_URL) {
    return { kind: 'api', url: `${API_URL}/v1/applications`, headers: {} }
  }
  if (SB_URL && SB_KEY) {
    return {
      kind: 'supabase',
      url: `${SB_URL}/rest/v1/applications`,
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
        // The anon role has no SELECT grant, so asking for the row back would fail
        // the request even though the insert succeeded.
        Prefer: 'return=minimal',
      },
    }
  }
  return null
}

/* Whether submissions can actually go anywhere. Everything user-facing branches on
   this rather than assuming. */
export function submissionsEnabled() {
  return submissionTarget() !== null
}

export async function submitApplication(record) {
  const target = submissionTarget()
  if (!target) throw new Error('Submissions are not configured yet.')

  let res
  try {
    res = await fetch(target.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...target.headers },
      body: JSON.stringify(record),
    })
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.')
  }

  if (!res.ok) {
    // Prefer the server's own message when it sends one — our Express service
    // returns {ok:false,error} and its validation errors are worth showing.
    let serverMsg = null
    try {
      const body = await res.json()
      if (typeof body?.error === 'string') serverMsg = body.error
    } catch {
      /* not JSON — fall through to the generic messages below */
    }
    if (serverMsg) throw new Error(serverMsg)

    if (res.status === 429) throw new Error('Too many submissions from here. Try again shortly.')
    if (res.status === 409) throw new Error('That looks like a duplicate application.')
    if (res.status === 401 || res.status === 403) {
      throw new Error('Submissions are not accepting entries right now.')
    }
    throw new Error(`Something went wrong (${res.status}). Your details were not saved.`)
  }

  return true
}
