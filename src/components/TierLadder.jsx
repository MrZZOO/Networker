import Asterisk from './common/Asterisk.jsx'
import RevealOnScroll from './common/RevealOnScroll.jsx'
import { TIERS } from '../lib/tiers.js'
import { CONFIG } from '../config.js'
import { formatFee } from '../lib/format.js'

/* The tier ladder — the product's core idea made visible.

   A tier describes WHO IS BEING REACHED, not who is doing the reaching. The same
   person holds the whole ladder: their builder network might be free and a tier-1
   fund partner expensive.

   The fee slot reads CONFIG.TIER_FEE_BANDS. Those are null and will stay null
   unless Dean declares floors and ceilings, so the card renders "Fee set by the
   lister" — which is the literal truth of the product, so the card never looks
   unfinished for want of a number nobody has decided. */

function BandFee({ tierId }) {
  const band = CONFIG.TIER_FEE_BANDS?.[tierId]
  const min = formatFee(band?.min)
  const max = formatFee(band?.max)

  if (!min && !max) {
    return <span className="tier-card__fee label">Fee set by the lister</span>
  }

  const text = min && max ? `${min.text} – ${max.text}` : (min ?? max).text
  return <span className="tier-card__fee tier-card__fee--num">{text}</span>
}

export default function TierLadder() {
  return (
    <section className="section" id="tiers">
      <RevealOnScroll>
        <div className="section__head">
          <span className="label">
            <Asterisk size={10} /> The ladder
          </span>
          <h2 className="section__title">
            One person, <em>four</em> kinds of door
          </h2>
          <p className="section__lede">
            You do not have a price. You have a ladder. Open the rooms you are happy
            to open, and price the ones that cost you something to open.
          </p>
        </div>

        <div className="tier-grid">
          {TIERS.map((t) => (
            <div className={`tier-card ${t.focal ? 'tier-card--focal' : ''}`} key={t.id}>
              <span className="tier-card__label">{t.label}</span>
              <p className="tier-card__who">{t.who}</p>
              <BandFee tierId={t.id} />
            </div>
          ))}
        </div>
      </RevealOnScroll>
    </section>
  )
}
