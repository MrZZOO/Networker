import { Link } from 'react-router-dom'
import Asterisk from './common/Asterisk.jsx'
import RevealOnScroll from './common/RevealOnScroll.jsx'
import ListingCard from './ListingCard.jsx'
import { intakeTarget } from '../lib/intake.js'

/* The roster — this project's version of Spinach's shelf and Popeye's floor.

   THE IDEA THAT MAKES AN EMPTY LAUNCHPAD WORK: the shelf is NUMBERED. Slot 001
   is unclaimed, 002 is unclaimed, and so on. A dashed outline still claims
   nothing — it is visibly an absence, which is the truth — but a numbered
   absence reads as scarcity and sequence rather than as a page that failed to
   load. The first slot is the prize, and it is genuinely still available.

   This is the only honest way I know to make a pre-launch launchpad feel alive
   without inventing a single listing. */

const OPEN_SLOTS = 8

function Slot({ n, index }) {
  const intake = intakeTarget()
  const num = String(n).padStart(3, '0')
  return (
    <Link
      className={`slot${n === 1 ? ' slot--first' : ''}`}
      to={intake.to}
      style={{ '--i': index, textDecoration: 'none' }}
    >
      <span className="slot__n">{num}</span>
      <span className="slot__claim">
        {n === 1 ? 'The first network on the roster.' : 'Unclaimed.'}
      </span>
      <span className="slot__label">Claim this slot →</span>
    </Link>
  )
}

export default function Roster({ listings = [] }) {
  const has = listings.length > 0
  const intake = intakeTarget()

  return (
    <section className="section" id="roster">
      <div className="container">
        <RevealOnScroll>
          <div className="section-head">
            <span className="eyebrow">
              <Asterisk size={10} /> The roster
            </span>
            <h2 className="display-h2">
              {has ? (
                <>
                  Networks <span className="grad-text">open</span> right now
                </>
              ) : (
                <>
                  Every slot is still <span className="grad-text">unclaimed</span>
                </>
              )}
            </h2>
            <p className="lede">
              {has
                ? 'Every listing says how the person knows that network and what an introduction from them actually gets you.'
                : 'Nobody has launched a network yet, so there is nothing here to browse — and no invented profiles standing in for the people who will be. The first to list set the market’s prices.'}
            </p>
          </div>

          <div className="roster">
            {has
              ? listings.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)
              : Array.from({ length: OPEN_SLOTS }, (_, i) => (
                  <Slot key={i} n={i + 1} index={i} />
                ))}
          </div>

          {!has && (
            <div style={{ marginTop: 26, display: 'flex', justifyContent: 'center' }}>
              <Link className="btn btn--amber" to={intake.to}>
                Take slot 001
              </Link>
            </div>
          )}
        </RevealOnScroll>
      </div>
    </section>
  )
}
