import { NETWORK_IDS, CUSTOM_NETWORK_MAX, sanitizeCustomNetwork } from './networks.js'
import { INTRO_LEVEL_IDS } from './introLevels.js'
import { TIER_IDS } from './tiers.js'
import { CHANNEL_IDS } from './channels.js'

/* Client-side validation for a listing application.

   This is a convenience, not a security boundary — the same rules are enforced
   again as CHECK constraints in the database, because anything running in a
   browser can be bypassed. Keep the two in step: supabase/migrations/0001. */

export const LIMITS = {
  displayName: 80,
  headline: 120,
  email: 160,
  handle: 80,
  provenance: 400,
  deliverable: 300,
  customNetwork: CUSTOM_NETWORK_MAX,
  maxOffers: 6,
  maxFee: 1_000_000,
  contactName: 80,
  contactRole: 100,
  maxContacts: 8,
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function emptyContact() {
  return { name: '', role: '', level: '' }
}

export function emptyOffer() {
  return {
    network: '',
    customNetwork: '',
    tier: '',
    provenance: '',
    deliverable: '',
    free: false,
    feeAmount: '',
    channels: [],
    // At least one named person — a network with no names in it is not a door
    // anyone can price.
    contacts: [emptyContact()],
  }
}

export function emptyApplication() {
  return {
    displayName: '',
    headline: '',
    email: '',
    handle: '',
    offers: [emptyOffer()],
    // Honeypot. A real person never fills this — it is visually hidden and
    // aria-hidden, so only a bot walking the DOM will.
    website: '',
  }
}

function req(value, field, label, max, errors) {
  const v = (value ?? '').trim()
  if (!v) errors[field] = `${label} is required`
  else if (v.length > max) errors[field] = `${label} must be ${max} characters or fewer`
}

export function validateOffer(offer, index) {
  const errors = {}
  const k = (f) => `offers.${index}.${f}`

  if (!NETWORK_IDS.includes(offer.network) && offer.network !== 'other') {
    errors[k('network')] = 'Pick a network'
  }
  if (offer.network === 'other') {
    const custom = sanitizeCustomNetwork(offer.customNetwork)
    if (!custom) errors[k('customNetwork')] = 'Name the network'
    else if (custom.length > LIMITS.customNetwork) {
      errors[k('customNetwork')] = `Keep it under ${LIMITS.customNetwork} characters`
    }
  }
  if (!TIER_IDS.includes(offer.tier)) errors[k('tier')] = 'Pick a tier'

  req(offer.provenance, k('provenance'), 'How you know them', LIMITS.provenance, errors)
  req(offer.deliverable, k('deliverable'), 'What you can do', LIMITS.deliverable, errors)

  if (!offer.free) {
    const n = Number(offer.feeAmount)
    if (offer.feeAmount === '' || Number.isNaN(n)) {
      errors[k('feeAmount')] = 'Enter a fee, or mark it free'
    } else if (n < 0) {
      errors[k('feeAmount')] = 'A fee cannot be negative'
    } else if (n === 0) {
      // 0 is a legal fee, but it means "free" — so say so rather than storing an
      // ambiguous zero that the card would render as "0".
      errors[k('feeAmount')] = 'Use the free toggle for a zero fee'
    } else if (n > LIMITS.maxFee) {
      errors[k('feeAmount')] = 'That is above the maximum we can list'
    }
  }

  const channels = offer.channels ?? []
  if (!channels.length) errors[k('channels')] = 'Pick at least one channel'
  else if (channels.some((c) => !CHANNEL_IDS.includes(c))) {
    errors[k('channels')] = 'Unknown channel'
  }

  const contacts = offer.contacts ?? []
  if (!contacts.length) errors[k('contacts')] = 'Add at least one person'
  else if (contacts.length > LIMITS.maxContacts) {
    errors[k('contacts')] = `Up to ${LIMITS.maxContacts} people per network`
  }
  contacts.forEach((c, ci) => {
    const ck = (f) => `offers.${index}.contacts.${ci}.${f}`
    req(c.name, ck('name'), 'A name', LIMITS.contactName, errors)
    req(c.role, ck('role'), 'Their role', LIMITS.contactRole, errors)
    if (!INTRO_LEVEL_IDS.includes(c.level)) errors[ck('level')] = 'Pick what you can offer'
  })

  return errors
}

export function validateApplication(app) {
  let errors = {}

  req(app.displayName, 'displayName', 'Your name', LIMITS.displayName, errors)
  req(app.headline, 'headline', 'Your headline', LIMITS.headline, errors)

  const email = (app.email ?? '').trim()
  if (!email) errors.email = 'Email is required — it is how we reach you about the listing'
  else if (!EMAIL.test(email)) errors.email = 'That does not look like an email address'
  else if (email.length > LIMITS.email) errors.email = 'That email is too long'

  if ((app.handle ?? '').trim().length > LIMITS.handle) {
    errors.handle = `Keep it under ${LIMITS.handle} characters`
  }

  const offers = app.offers ?? []
  if (!offers.length) errors.offers = 'Add at least one network'
  else if (offers.length > LIMITS.maxOffers) {
    errors.offers = `You can list up to ${LIMITS.maxOffers} networks in one application`
  }

  offers.forEach((offer, i) => {
    errors = { ...errors, ...validateOffer(offer, i) }
  })

  return errors
}

/* Shape the form state into the record that goes to the database. Trims, coerces
   the fee to a number, and drops the honeypot. */
export function toRecord(app) {
  return {
    display_name: app.displayName.trim(),
    headline: app.headline.trim(),
    contact_email: app.email.trim().toLowerCase(),
    contact_handle: (app.handle ?? '').trim() || null,
    offers: (app.offers ?? []).map((o) => ({
      network: o.network,
      customNetwork: o.network === 'other' ? sanitizeCustomNetwork(o.customNetwork) : null,
      tier: o.tier,
      provenance: o.provenance.trim(),
      deliverable: o.deliverable.trim(),
      free: !!o.free,
      // Fees are quoted in USD because the platform token has no ticker yet.
      // Storing the currency explicitly means a later denomination in $TOKEN is a
      // conversion, not a guess about what the number meant.
      feeAmount: o.free ? 0 : Number(o.feeAmount),
      feeCurrency: 'USD',
      channels: o.channels ?? [],
      contacts: (o.contacts ?? []).map((c) => ({
        name: c.name.trim(),
        role: c.role.trim(),
        level: c.level,
      })),
    })),
  }
}
