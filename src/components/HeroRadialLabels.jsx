import NetworkPlate from './common/NetworkPlate.jsx'
import Asterisk from './common/Asterisk.jsx'
import { CONFIG } from '../config.js'
import { connector, LABEL_ANGLES } from '../lib/geometry.js'

/* The circular inset with thin radial connector lines from the reference.

   Two things worth knowing about the implementation:

   1. The SVG lines and the HTML labels are positioned from the SAME angle
      constants (lib/geometry.js), so they cannot drift apart when the box resizes.

   2. The labels are HTML, not SVG <text>. They inherit the exact letter-spacing
      tokens, wrap properly, stay selectable and stay accessible — none of which is
      true of <text>.

   Label copy is MECHANISM, never metrics. The reference's "EASE OF USE / SECURITY
   AND PRIVACY / POWERFUL TOOLS" are generic claims; these are specific, and true on
   day one. The first is the reframe the whole product rests on: the fee is not a
   price tag, it is a filter that happens to pay. */

/* Circle sits right, lines run left toward the headline. viewBox units. */
const CIRCLE = { cx: 288, cy: 200, r: 86 }
const GUTTER_X = 156

/* Short by necessity — these sit in a narrow gutter and must not wrap past two
   lines. The fuller statements live in the stacked mobile version below. */
const LABELS = ['The fee is the filter', 'Consent required', 'LinkedIn · X · Telegram']
const LABELS_STACKED = [
  'The fee is the filter',
  'Nothing without your consent',
  'LinkedIn · X · Telegram · In person',
]

export default function HeroRadialLabels() {
  const lines = LABEL_ANGLES.map((angle) =>
    connector({ ...CIRCLE, angle, gutterX: GUTTER_X })
  )

  return (
    <div className="radial">
      {/* The drawn cluster — hidden below 900px, where the geometry has no room. */}
      <div className="radial__figure">
        <div className="radial__circle">
          {CONFIG.HERO_INSET_IMAGE ? (
            <img src={CONFIG.HERO_INSET_IMAGE} alt="" />
          ) : (
            <NetworkPlate seed={7} variant="inset" />
          )}
        </div>

        <svg className="radial__svg" viewBox="0 0 400 400" fill="none" aria-hidden="true">
          <g stroke="var(--on-wash-line)" strokeWidth="1" vectorEffect="non-scaling-stroke">
            {lines.map((l, i) => (
              <polyline key={i} points={l.points} />
            ))}
          </g>
          <g fill="var(--on-wash-line)">
            {lines.map((l, i) => (
              <g key={i}>
                <circle cx={l.start.x} cy={l.start.y} r="2.5" />
                <circle cx={l.end.x} cy={l.end.y} r="2.5" />
              </g>
            ))}
          </g>
        </svg>

        {lines.map((l, i) => (
          <span
            key={i}
            className="radial__label label"
            style={{ right: `${100 - l.anchorPct.x}%`, top: `${l.anchorPct.y}%` }}
          >
            {LABELS[i]}
          </span>
        ))}
      </div>

      {/* Below 900px: a plain asterisk-led stack. No half-drawn geometry on a phone. */}
      <ul className="radial__stack">
        {LABELS_STACKED.map((text) => (
          <li key={text} className="label">
            <Asterisk size={10} />
            {text}
          </li>
        ))}
      </ul>
    </div>
  )
}
