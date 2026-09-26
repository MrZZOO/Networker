import Asterisk from './common/Asterisk.jsx'
import RevealOnScroll from './common/RevealOnScroll.jsx'
import { CONFIG } from '../config.js'
import { formatPct, formatWindow } from '../lib/format.js'

/* The three-up stat row every launchpad opens with.

   The hard part: Spinach shows "12 / 10 of 12 / 1" because those are real. Ours
   are all zero, and a launchpad reading 0 / 0 / 0 does not read as "new" — it
   reads as "the market ran and nobody came".

   So a null renders an em-dash plus a hint saying what will fill it. Three
   states, same as the rest of this codebase: a real number, or a true sentence,
   or a styled vacancy. Never a 0 posing as traction. */

function Tile({ label, value, hint }) {
  const empty = value == null
  return (
    <div className="glass glass--hover stat-tile">
      <div className="stat-tile__label">{label}</div>
      <div className={`stat-tile__value${empty ? ' stat-tile__value--none' : ''}`}>
        {empty ? '—' : value}
      </div>
      <div className="stat-tile__hint">{hint}</div>
    </div>
  )
}

export default function LiveStats() {
  const { LISTER_COUNT, INTRO_COUNT, MEDIAN_REPLY_HOURS } = CONFIG

  const listers = typeof LISTER_COUNT === 'number' && LISTER_COUNT > 0 ? LISTER_COUNT : null
  const intros = typeof INTRO_COUNT === 'number' && INTRO_COUNT > 0 ? INTRO_COUNT : null
  const reply = formatWindow(MEDIAN_REPLY_HOURS)

  return (
    <section className="section" id="stats">
      <div className="container">
        <RevealOnScroll>
          <div className="stats-grid">
            <Tile
              label="Networks open"
              value={listers}
              hint={listers ? 'live on the roster' : 'the roster opens with the first listing'}
            />
            <Tile
              label="Introductions made"
              value={intros}
              hint={intros ? 'confirmed by the people who asked' : 'counted only once a buyer confirms one landed'}
            />
            <Tile
              label="Median reply"
              value={reply}
              hint={reply ? 'across every open network' : 'measured once requests start arriving'}
            />
          </div>

          <p
            className="mono"
            style={{ marginTop: 14, fontSize: 11, letterSpacing: '0.12em', color: 'var(--dim)', textTransform: 'uppercase' }}
          >
            <Asterisk size={9} style={{ display: 'inline-block', verticalAlign: '-1px', marginRight: 8 }} />
            Pre-launch · these fill from real activity, never from estimates
          </p>
        </RevealOnScroll>
      </div>
    </section>
  )
}

/* Exported for the roster's own use so the two cannot disagree about what
   "open" means. */
export function hasListings() {
  return typeof CONFIG.LISTER_COUNT === 'number' && CONFIG.LISTER_COUNT > 0
}

export { formatPct }
