import NetworkPlate from './common/NetworkPlate.jsx'
import HeroProofPill from './HeroProofPill.jsx'
import HeroRadialLabels from './HeroRadialLabels.jsx'
import HeroTagCloud from './HeroTagCloud.jsx'
import { CONFIG } from '../config.js'

/* The one big rounded card.

   The headline sets `max-width: 14ch` rather than hard-coded <br>s — that is what
   forces the reference's ~4-line wrap at every viewport instead of breaking badly
   on resize. */

/* Fallback only — CONFIG.TAGLINE is filled, so this is what renders if it is ever
   cleared. Kept neutral and literally true.

   An earlier draft read "Open the doors that money cannot knock on". It was cut
   because it contradicts the product: the entire mechanism is money knocking on
   doors. A headline that argues against the thing it is selling is a misnomer, not
   a flourish. */
const DEFAULT_TAGLINE = 'A market for the introductions you cannot buy anywhere else'

function IconButton({ label, onClick, children }) {
  return (
    <button className="icon-btn" type="button" onClick={onClick} aria-label={label}>
      {children}
    </button>
  )
}

export default function Hero() {
  const title = CONFIG.TAGLINE ?? DEFAULT_TAGLINE

  const scrollTo = (id) => () => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="hero" id="top">
      <div className="hero__card">
        {CONFIG.HERO_IMAGE ? (
          <>
            <img className="hero__img" src={CONFIG.HERO_IMAGE} alt="" />
            {/* Two passes: veil tints the photo blue, shade darkens under the type. */}
            <span className="hero__veil" aria-hidden="true" />
            <span className="hero__shade" aria-hidden="true" />
          </>
        ) : (
          <NetworkPlate seed={3} variant="hero" className="hero__plate" />
        )}

        <div className="hero__grid">
          <div className="hero__proof">
            <HeroProofPill />
          </div>

          <div className="hero__radial">
            <HeroRadialLabels />
          </div>

          <div className="hero__links">
            <IconButton label="Scroll to how it works" onClick={scrollTo('how')}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                <path
                  d="M12 5v14M6 13l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </IconButton>
            <IconButton label="Jump to the networks" onClick={scrollTo('networks')}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </IconButton>
            <a className="hero__link label" href="#how">
              How the market works →
            </a>
          </div>

          <h1 className="hero__title">{title}</h1>

          <div className="hero__tags">
            <HeroTagCloud />
          </div>
        </div>
      </div>

      {/* Null renders nothing at all — no empty paragraph holding space. */}
      {CONFIG.SUBLINE && <p className="hero__sub">{CONFIG.SUBLINE}</p>}
    </header>
  )
}
