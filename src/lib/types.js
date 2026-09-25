/* ─── The product model ──────────────────────────────────────────────────────
   Shapes and enums only. This file EXPORTS NO RECORDS — there is deliberately
   nowhere here for a fake listing to hide. Real listings arrive from a backend
   (Supabase, deferred) and nowhere else.

   The central idea: a person does not have one price, they have a LADDER. The same
   lister might open their builder network free and charge heavily for a tier-1 fund
   partner. So the fee lives on the OFFER, not on the listing. That is what makes
   both halves of the brief true at once — fees track the tier of the network, and
   listers still charge whatever they like. */

export const REQUEST_STATUS = [
  'draft',
  'pending',
  'accepted',
  'refused',
  'expired',
  'completed',
  'refunded',
]

export const VERIFY_STATUS = [
  'unverified',    // v1 default, and SHOWN rather than hidden
  'account-linked', // OAuth proved they operate the handle — nothing about who they know
  'vouched',        // attested by other verified listers
  'track-record',   // intros the BUYER confirmed landed. The only signal that can't be faked.
]

/**
 * One tier of reach a lister is opening, with its own price.
 *
 * `provenance` and `deliverable` are the two fields that carry the product. They
 * replace a single vague "description" because they force the two questions a
 * buyer is silently asking, and a listing that cannot answer both is not worth
 * buying.
 *
 * @typedef {Object} NetworkOffer
 * @property {string}   id
 * @property {string}   network       id from lib/networks.js, or 'other'
 * @property {string|null} customNetwork  free text when network === 'other'; sanitised
 * @property {string}   tier          id from lib/tiers.js
 * @property {string}   provenance    HOW they know this network. A claim about the
 *                                    PAST — "Partner at ___ 2019-2024, still in the
 *                                    IC channel." Self-declared, and labelled as
 *                                    such: it sits beside the verification badge and
 *                                    inherits its framing.
 * @property {string}   deliverable   WHAT connection they can make. A promise about
 *                                    the FUTURE — "Warm intro to a partner, not an
 *                                    associate." This is what the fee buys, so it
 *                                    sits beside the fee, and it is what a refund is
 *                                    measured against: if the intro described here
 *                                    did not happen, that is the dispute.
 * @property {number}   feeAmount     in token base units. 0 is legal and meaningful —
 *                                    it renders a "FREE" pill, never the string "0".
 * @property {string|null} feeToken   symbol; null → renders "fee" with no unit
 * @property {string[]} channels      subset of the lister's channels
 * @property {number|null} slotsPerMonth  self-imposed cap; null → no cap shown
 */

/**
 * A person offering access. Carries IDENTITY only — everything about reach lives
 * on the offers, where it belongs.
 *
 * @typedef {Object} Listing
 * @property {string}  id
 * @property {string}  handle          URL slug → /u/:handle (route deferred)
 * @property {string}  displayName
 * @property {string|null} headline    one line, self-written
 * @property {string|null} bio         short paragraph, self-written
 * @property {string|null} avatarUrl   null → initials plate. NEVER a stock face.
 * @property {NetworkOffer[]} offers
 * @property {string}  verification    from VERIFY_STATUS; 'unverified' is shown, not hidden
 * @property {boolean} acceptingRequests   the lister's own on/off switch
 * @property {number|null} responseRatePct null until enough real requests exist
 * @property {number|null} medianReplyHrs  null → the stat is NOT RENDERED AT ALL,
 *                                          not rendered as "—" and not as "0%"
 * @property {number}  introsCompleted     0 → "no intros yet", never a fake number
 * @property {string}  createdAt       ISO
 */

/**
 * The transaction.
 *
 * @typedef {Object} ConnectionRequest
 * @property {string}  id
 * @property {string}  listingId
 * @property {string}  offerId         which tier and price was requested
 * @property {string}  requesterId
 * @property {string}  message         why they want it — required, capped ~600 chars
 * @property {string}  preferredChannel
 * @property {number}  feeAmount       snapshotted at request time, so a later price
 *                                     change cannot apply retroactively
 * @property {string|null} feeToken
 * @property {string}  status          from REQUEST_STATUS
 * @property {string|null} escrowRef   on-chain reference. NULL MEANS NO FUNDS MOVED,
 *                                     and the UI must say so rather than implying a
 *                                     payment occurred.
 * @property {string}  createdAt
 * @property {string|null} respondedAt
 * @property {string|null} responseNote  optional line on accept OR refuse
 * @property {string|null} expiresAt     auto-refund deadline; null → no countdown
 */

/* The state machine. Single source of truth for every button's enabled state.

     draft ──▶ pending ──▶ accepted ──▶ completed
                 │
                 ├──▶ refused ──▶ refunded
                 └──▶ expired ──▶ refunded

   A refusal is a first-class, cost-free outcome for the lister — encoded here
   rather than bolted on. Without the refund a paid request is irrational and
   nobody pays twice. */
export const REQUEST_TRANSITIONS = {
  draft:     ['pending'],
  pending:   ['accepted', 'refused', 'expired'],
  accepted:  ['completed'],
  refused:   ['refunded'],
  expired:   ['refunded'],
  completed: [],
  refunded:  [],
}

export function canTransition(from, to) {
  return (REQUEST_TRANSITIONS[from] ?? []).includes(to)
}

/* True when a request's fee is still held and owed back to the requester. */
export function isRefundOwed(request) {
  return request?.status === 'refused' || request?.status === 'expired'
}
