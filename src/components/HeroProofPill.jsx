import AvatarStack from './common/AvatarStack.jsx'
import { CONFIG } from '../config.js'

/* The top-left pill from the reference, where "250+ SATISFIED & OPEN USERS" sits.

   That slot is unfillable and unfakeable on day one, so this component keeps the
   GEOMETRY and swaps the PAYLOAD. Priority order:

     real lister count   ──▶ "12 NETWORKS LISTED" + real avatars
     real waitlist count ──▶ "40 IN THE OPEN CALL"
     neither             ──▶ CONFIG.MECHANIC_LINE + dashed vacancy rings

   The pill never disappears, never shrinks, and never shows a zero. A count of
   nothing is not "0 networks" — it is a different, true sentence. */
export default function HeroProofPill() {
  const { LISTER_COUNT, WAITLIST_COUNT, PROOF_AVATARS, MECHANIC_LINE } = CONFIG

  let text
  let avatars = []

  if (typeof LISTER_COUNT === 'number' && LISTER_COUNT > 0) {
    text = `${LISTER_COUNT}+ networks listed`
    avatars = PROOF_AVATARS ?? []
  } else if (typeof WAITLIST_COUNT === 'number' && WAITLIST_COUNT > 0) {
    text = `${WAITLIST_COUNT} in the open call`
    avatars = PROOF_AVATARS ?? []
  } else {
    text = MECHANIC_LINE
  }

  return (
    <div className="proofpill">
      <AvatarStack avatars={avatars} />
      <span className="proofpill__text label">{text}</span>
    </div>
  )
}
