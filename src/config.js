/* ─── Owner-editable config — the no-fake-data gate ──────────────────────────
   Every project-specific claim on the page reads from here. Null/[] slots render
   NOTHING, or a neutral true statement, until the real value is filled in.
   Never put a guess here — an empty slot is honest, an invented one is not.

   HARD RULE FOR THIS PROJECT: listings are records about REAL PEOPLE. Never add a
   listing for anyone who has not personally agreed to be listed. Not as an example,
   not as a placeholder, not greyed out. The directory being empty is the CORRECT
   state until real people sign up.

   THE RENDER CONTRACT: a component may read a slot and branch, but may never
   substitute a plausible number for a null. It substitutes exactly one of three
   things — nothing, a spec-true sentence, or a styled vacancy. There is no fourth.

   In dev a corner banner lists which slots are still empty. Never in prod. */

export const CONFIG = {
  // ── Identity ───────────────────────────────────────────────────────────────
  NAME: 'Networker',        // brand wordmark in nav + footer. Never null.
  // Hero H1 — Dean's call, 2026-09-25. Mirrors the reference's "Dive into the
  // world of…" structure. Replaced an earlier draft that claimed these were doors
  // money could not knock on, which is the opposite of what the product does.
  TAGLINE: 'Dive into the world of networks you need',
  SUBLINE: null,            // hero sub-line. null → renders nothing at all
  DOMAIN: null,             // canonical URL. null → the OG url tag is omitted

  // ── Market state — the "is this live yet" switch ───────────────────────────
  // 'open-call' → no listings exist. The directory shows the open-call state and
  //               request buttons render DISABLED WITH A VISIBLE REASON.
  // 'live'      → listings exist; the full marketplace UI.
  // Never hide a control the user might look for — disable it and say why.
  MARKET_STATE: 'open-call',

  // ── Token + fees ───────────────────────────────────────────────────────────
  TOKEN_SYMBOL: null,       // e.g. 'NTWK'. null → fees read "fee", never "12 NTWK",
                            //   and the "paid in the platform token" line is suppressed
  TOKEN_ADDRESS: null,      // null → no contract link, no explorer button anywhere
  TOKEN_DECIMALS: null,     // null → fee amounts render as integers only
  PLATFORM_FEE_PCT: null,   // % Networker takes off an accepted intro. null → the
                            //   revenue line reads "Platform fee to be announced."

  // SPEC, founder-declared: a refused or expired request is refunded in full. This
  // is a RULE, not data, so it is safe to state on day one. It is also the thing
  // that makes a paid request rational — without it nobody pays twice.
  REFUND_ON_REFUSE: true,

  // ── Tier fee bands ─────────────────────────────────────────────────────────
  // Tier ids and order are product spec and live in lib/tiers.js. The fee inside
  // each band is NOT ours to invent — each lister sets their own price. Until Dean
  // declares floors/ceilings these stay null and the tier card renders
  // "FEE SET BY THE LISTER", which is the literal truth of the product, so the
  // card never looks unfinished.
  TIER_FEE_BANDS: {
    open:      { min: null, max: null },
    community: { min: null, max: null },
    operator:  { min: null, max: null },
    inner:     { min: null, max: null },
  },

  // ── Social proof — the slots that CANNOT be guessed ────────────────────────
  // Counts render ONLY when a real backend has counted them. Until then the hero
  // proof pill shows MECHANIC_LINE instead of a number: same pill, same corner,
  // same weight, no invented traction.
  LISTER_COUNT: null,       // null → pill shows MECHANIC_LINE. No number, no "+".
  INTRO_COUNT: null,        // null → the "intros made" stat is not rendered at all
  WAITLIST_COUNT: null,     // null → "join the open call", with no count
  PROOF_AVATARS: [],        // [] → AvatarStack renders 3 dashed vacancy rings

  // The always-true fallback. Register matters here: the supply side is people who
  // already get more inbound than they can read, and their objection is not "can I
  // say no" — it is "does listing here make me look for sale?". So this line states
  // control, not permission. See the Register section of the plan.
  MECHANIC_LINE: 'INTRODUCTIONS AT YOUR DISCRETION',

  // ── Imagery ────────────────────────────────────────────────────────────────
  // No stock photos of people, ever: a stock face beside a network tier reads as a
  // listing, which makes it a fabricated person.
  // null → <NetworkPlate/> draws a procedural blue-wash node graph instead.
  // Two hands reaching, not touching — the Creation of Adam composition Dean asked
  // for. Photo by Elijah Grimm, free under the Unsplash License (no attribution
  // required; credited here anyway). The reference design's own photo is licensed
  // stock and was not used.
  HERO_IMAGE: '/hero.jpg',
  // The circular inset: the same photo, cropped tight on the gap between the two
  // fingertips. The near-touch magnified is the whole product in one detail.
  HERO_INSET_IMAGE: '/hero.jpg',
  FEATURE_IMAGES: [],       // [] → every small photo card falls back to NetworkPlate

  // ── Intake ─────────────────────────────────────────────────────────────────
  // Where a would-be lister actually goes. In v1 there is no form, because a form
  // that cannot submit is worse than a link that works — the CTA opens whichever
  // of these is filled first (telegram → x → email). All null → the CTA renders
  // disabled with its reason shown.
  INTAKE_ENDPOINT: null,    // reserved for the real form, once a backend exists
  CONTACT_EMAIL: null,      // null → no mailto link renders

  // ── Verification (deferred) ────────────────────────────────────────────────
  // null → every listing shows UNVERIFIED honestly and the page explains what
  // verification will and will not mean. No badge is ever shown speculatively, and
  // graph verification is never promised — see the plan's honest read on why.
  VERIFICATION_METHOD: null,  // 'oauth' | 'vouch' | 'track-record' | null

  // ── Socials — only non-null entries render in the footer ───────────────────
  SOCIALS: {
    x: null,
    telegram: null,
    linkedin: null,
  },

  // ── Backend (deferred → Supabase free tier) ────────────────────────────────
  // null → the app runs fully offline: no fetches, no spinners, no error cards.
  API_URL: null,
}

/* Slots the dev banner watches. Kept as an explicit list rather than walking the
   object, because some nulls are load-bearing (TOKEN_ADDRESS stays null until there
   IS a token) and flagging those every run would train us to ignore the banner. */
export const WATCHED_SLOTS = [
  'TAGLINE',
  'SUBLINE',
  'DOMAIN',
  'TOKEN_SYMBOL',
  'PLATFORM_FEE_PCT',
  'HERO_IMAGE',
  'HERO_INSET_IMAGE',
  'FEATURE_IMAGES',
  'CONTACT_EMAIL',
  'SOCIALS.x',
  'SOCIALS.telegram',
]
