import { useState } from 'react'
import Asterisk from './common/Asterisk.jsx'
import RevealOnScroll from './common/RevealOnScroll.jsx'
import { TIERS } from '../lib/tiers.js'
import { CONFIG } from '../config.js'
import { formatFee } from '../lib/format.js'

/* The ladder — the product's core idea made visible.

   A tier describes WHO IS BEING REACHED, not who is doing the reaching. One
   person holds the whole ladder: their builder network might be free and a
   tier-1 fund partner expensive. */

function BandFee({ tierId }) {
  const band = CONFIG.TIER_FEE_BANDS?.[tierId]
  const min = formatFee(band?.min)
  const max = formatFee(band?.max)
  if (!min && !max) return <span className="tier-card__fee">Fee set by the lister</span>
  const text = min && max ? `${min.text} – ${max.text}` : (min ?? max).text
  return <span className="tier-card__fee">{text}</span>
}

export default function TierLadder() {
  const [active, setActive] = useState(TIERS.find((t) => t.focal)?.id ?? TIERS[0].id)

  return (
    <section className="section" id="tiers">
      <div className="container">
        <RevealOnScroll>
          <div className="section-head">
            <span className="eyebrow eyebrow--amber">
              <Asterisk size={10} /> The ladder
            </span>
            <h2 className="display-h2">
              One person, four kinds of <span className="grad-text">door</span>
            </h2>
            <p className="lede">
              You do not have a price. You have a ladder. Open the rooms you are
              happy to open, and price the ones that cost you something to open.
            </p>
          </div>

          <div className="tier-grid">
            {TIERS.map((t) => (
              <button
                type="button"
                key={t.id}
                className={`glass tier-card ${active === t.id ? 'is-active' : ''}`}
                onClick={() => setActive(t.id)}
                aria-pressed={active === t.id}
              >
                <span className="tier-card__label">{t.label}</span>
                <p className="tier-card__who">{t.who}</p>
                <BandFee tierId={t.id} />
              </button>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
