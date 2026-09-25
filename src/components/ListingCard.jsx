import { initials, formatFee, formatPct } from '../lib/format.js'
import { resolveNetwork } from '../lib/networks.js'
import { getTier } from '../lib/tiers.js'
import { getChannel, channelsForListing } from '../lib/channels.js'

/* One person's listing.

   This component ONLY ever renders from a real Listing record. There is no
   default-props path that produces a card out of nothing — that is deliberate, so
   there is no way to accidentally ship a plausible-looking fake.

   `provenance` is the line a buyer scans first, so it sits directly under the name
   rather than behind a click. Stats that are null are NOT RENDERED AT ALL — not as
   a dash, not as 0%. A backend that has counted nothing has nothing to report. */

function VerificationBadge({ status }) {
  const copy = {
    unverified: ['Unverified', 'Nothing about this listing has been checked yet.'],
    'account-linked': ['Account verified', 'They operate this handle. Reach is self-declared.'],
    vouched: ['Vouched', 'Attested by other verified listers.'],
    'track-record': ['Track record', 'Introductions confirmed by the people who received them.'],
  }
  const [label, title] = copy[status] ?? copy.unverified
  return (
    <span className={`verif verif--${status ?? 'unverified'} label`} title={title}>
      {label}
    </span>
  )
}

function OfferRow({ offer }) {
  const network = resolveNetwork(offer)
  const tier = getTier(offer.tier)
  const fee = formatFee(offer.feeAmount, offer.feeToken)

  return (
    <li className="offer">
      <div className="offer__head">
        <span className="offer__net">
          {network?.label ?? 'Network'}
          {network?.custom && <em className="offer__custom label">custom</em>}
        </span>
        {tier && <span className="offer__tier label">{tier.label}</span>}
      </div>

      {/* The promise about the future. This is what the fee buys, and what a refund
          is measured against. */}
      <p className="offer__deliverable">{offer.deliverable}</p>

      <div className="offer__foot">
        {fee ? (
          fee.free ? (
            <span className="offer__fee offer__fee--free label">Free</span>
          ) : (
            <span className="offer__fee">{fee.text}</span>
          )
        ) : null}
        <span className="offer__channels">
          {(offer.channels ?? []).map((id) => {
            const c = getChannel(id)
            return c ? (
              <span className="offer__chan label" key={id}>
                {c.label}
              </span>
            ) : null
          })}
        </span>
      </div>
    </li>
  )
}

export default function ListingCard({ listing }) {
  if (!listing) return null

  const responseRate = formatPct(listing.responseRatePct)
  const channels = channelsForListing(listing)

  return (
    <article className="listing">
      <header className="listing__head">
        <span className="listing__avatar">
          {listing.avatarUrl ? (
            <img src={listing.avatarUrl} alt="" />
          ) : (
            initials(listing.displayName)
          )}
        </span>
        <div className="listing__id">
          <h3 className="listing__name">{listing.displayName}</h3>
          {listing.headline && <p className="listing__headline">{listing.headline}</p>}
        </div>
        <VerificationBadge status={listing.verification} />
      </header>

      {/* Provenance — the claim about the past. Sits beside the verification badge
          and inherits its self-declared framing. */}
      {listing.offers?.[0]?.provenance && (
        <p className="listing__provenance">{listing.offers[0].provenance}</p>
      )}

      {listing.offers?.length > 0 && (
        <ul className="listing__offers">
          {listing.offers.map((o) => (
            <OfferRow offer={o} key={o.id} />
          ))}
        </ul>
      )}

      <footer className="listing__foot">
        {channels.length > 0 && (
          <span className="label">{channels.length} channels open</span>
        )}
        {/* Null stats render nothing. Never a dash, never a zero. */}
        {responseRate && <span className="label">{responseRate} reply rate</span>}
        {listing.introsCompleted > 0 && (
          <span className="label">{listing.introsCompleted} intros made</span>
        )}
      </footer>
    </article>
  )
}
