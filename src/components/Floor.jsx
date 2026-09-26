import { Link } from 'react-router-dom'
import Asterisk from './common/Asterisk.jsx'
import RevealOnScroll from './common/RevealOnScroll.jsx'
import ListingCard from './ListingCard.jsx'
import { NETWORKS } from '../lib/networks.js'
import { TIERS } from '../lib/tiers.js'
import { intakeTarget } from '../lib/intake.js'

/* THE FLOOR — the BUY side of the market.

   This is where you browse networks you can pay to be introduced into. The
   token-launchpad equivalent is Popeye's /tokens: the list of things already
   launched that you can now buy. It is NOT the place you list your own network
   — that is /list, and conflating the two just gives the page two "launch"
   buttons wearing different words.

   Nothing has launched, so there is nothing to buy. The honest empty state says
   exactly that and offers the only action that is actually available: be the
   first to launch one. No invented profiles, and no numbered slots inviting you
   to claim one, because claiming is the other side of the market. */

function Filters({ disabled }) {
  /* Rendered, not hidden. Showing the real filters greyed out tells a visitor
     what browsing will look like far better than hiding the controls until
     there is something to filter — and the reason is stated, never implied. */
  return (
    <div className="filters" aria-label="Filter the floor">
      <div className="filters__row">
        <span className="filters__label">Tier</span>
        {TIERS.map((t) => (
          <button key={t.id} type="button" className="chip chip--plain filters__chip" disabled={disabled}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="filters__row">
        <span className="filters__label">Network</span>
        {NETWORKS.slice(0, 5).map((n) => (
          <button key={n.id} type="button" className="chip chip--plain filters__chip" disabled={disabled}>
            {n.label}
          </button>
        ))}
        <span className="chip chip--plain filters__chip is-more">+2 more</span>
      </div>
    </div>
  )
}

export default function Floor({ listings = [] }) {
  const has = listings.length > 0
  const intake = intakeTarget()

  return (
    <section className="section" id="floor">
      <div className="container">
        <RevealOnScroll>
          <div className="section-head">
            <span className="eyebrow">
              <Asterisk size={10} /> The floor
            </span>
            <h2 className="display-h2">
              {has ? (
                <>
                  Networks you can <span className="grad-text">reach</span> today
                </>
              ) : (
                <>
                  Nothing on the floor <span className="grad-text">yet</span>
                </>
              )}
            </h2>
            <p className="lede">
              {has
                ? 'Every listing says how the person knows that network, what an introduction from them actually gets you, and what it costs.'
                : 'This is where you browse the networks people are willing to open, and pay to be introduced into. Nobody has launched one yet, so there is nothing to buy — and no invented profiles standing in for the people who will be here.'}
            </p>
          </div>

          <Filters disabled={!has} />

          {has ? (
            <div className="floor-grid">
              {listings.map((l, i) => (
                <ListingCard key={l.id} listing={l} index={i} />
              ))}
            </div>
          ) : (
            <div className="glass floor-empty">
              <Asterisk size={22} strokeWidth={1.4} />
              <h3 className="floor-empty__title">The floor is wide open</h3>
              <p className="floor-empty__body">
                The moment someone launches a network it appears here — their tiers,
                their fee, and the channels they will take an introduction on. Until
                then this stays empty rather than filling with examples.
              </p>
              <div className="floor-empty__row">
                <Link className="btn btn--amber" to={intake.to}>
                  Be the first to launch
                </Link>
                <span className="btn-with-reason">
                  <span className="btn btn--ghost is-disabled" aria-disabled="true">
                    Request an introduction
                  </span>
                  <span className="btn-reason">Needs a network on the floor</span>
                </span>
              </div>
            </div>
          )}
        </RevealOnScroll>
      </div>
    </section>
  )
}
