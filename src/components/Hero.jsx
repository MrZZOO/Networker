import { Link } from 'react-router-dom'
import Asterisk from './common/Asterisk.jsx'
import NetworkPlate from './common/NetworkPlate.jsx'
import { CONFIG } from '../config.js'
import { intakeTarget } from '../lib/intake.js'

/* The hero, launchpad-shaped: text left, a floating object over a glow orb on
   the right — the same composition Spinach uses for its can.

   The headline follows the house pattern: plain text with exactly ONE word
   carrying the gradient. Never a fully gradient heading. */

const DEFAULT_TAGLINE = 'Dive into the world of networks you need'

/* Split the tagline so the last word can carry the gradient without hardcoding
   the copy — change CONFIG.TAGLINE and the emphasis follows. */
function Headline({ text }) {
  const words = text.trim().split(/\s+/)
  const last = words.pop()
  return (
    <h1 className="display-h1">
      {words.join(' ')} <span className="grad-text">{last}</span>
    </h1>
  )
}

export default function Hero() {
  const intake = intakeTarget()

  return (
    <header className="hero" id="top">
      <div className="container">
        <div className="hero__grid">
          <div>
            <span className="eyebrow">
              <Asterisk size={10} />
              A launchpad for networks · pre-launch
            </span>

            <Headline text={CONFIG.TAGLINE ?? DEFAULT_TAGLINE} />

            <p className="lede">
              List the rooms you are already in, price the door, and take only the
              requests worth taking. The fee is the filter — and every refusal
              refunds in full.
            </p>

            <div className="hero__ctas">
              <Link className="btn btn--amber" to={intake.to}>
                Launch your network
              </Link>
              {/* Points at the roster, not the explainer — "find your network"
                  promises the market itself, and landing on a how-it-works
                  section instead would be a bait. */}
              <a className="btn btn--ghost" href="#roster">
                Find your network ↓
              </a>
            </div>
          </div>

          <div className="hero__art" aria-hidden="true">
            <div className="hero__glow" />
            <div className="hero__photo">
              {CONFIG.HERO_IMAGE ? (
                <>
                  <img src={CONFIG.HERO_IMAGE} alt="" />
                  <span className="hero__photo-tint" />
                </>
              ) : (
                <NetworkPlate seed={3} variant="hero" />
              )}
              <span className="hero__photo-shade" />
              <span className="hero__photo-cap">Introductions at your discretion</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
