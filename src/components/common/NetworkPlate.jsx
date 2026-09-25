import { useMemo, useId } from 'react'
import { seededRandom } from '../../lib/geometry.js'

/* The no-photography answer.

   The reference design is photo-driven: a full-bleed hero shot, a circular inset,
   six small cards. Networker has no brand imagery, and it CANNOT use stock photos
   of people — a stock face beside a network tier reads as a listing, which makes it
   a fabricated person. Grey boxes are the other bad option.

   So every image slot falls through to this: the blue wash plus a faint
   node-and-edge graph. Abstract, on-concept, claims nothing, no licensing, no
   layout shift. When real images arrive, PhotoCard swaps them in at the same
   aspect ratio and radius and nothing in the layout moves.

   Positions come from a seeded PRNG so each plate differs but NEVER re-randomises
   between renders — a plate that reshuffles on every paint reads as a glitch. */

/* The coordinate space is roughly pixel-scale at the sizes these actually render,
   so node radii and stroke widths below are close to their on-screen values. A
   100×100 viewBox stretched over a 1400px card turns r=1.5 into a 20px blob — this
   is a background texture, not the subject, and it has to stay quiet. */
/* Each variant carries its OWN coordinate space, sized close to the pixels it
   actually renders into. That is the only way node radii stay visually consistent:
   a single shared viewBox makes the hero's dots correct and shrinks the inset
   circle's to sub-pixel, which is exactly how the inset first came out blank. */
const VARIANTS = {
  hero:  { w: 1200, h: 800, nodes: 64, linkDist: 210, r: [1.6, 2.6], stroke: 0.75, opacity: 0.5 },
  inset: { w: 260,  h: 260, nodes: 26, linkDist: 78,  r: [1.4, 1.8], stroke: 0.6,  opacity: 0.9 },
  card:  { w: 400,  h: 300, nodes: 26, linkDist: 110, r: [2.0, 2.6], stroke: 0.7,  opacity: 0.66 },
}

export default function NetworkPlate({ seed = 1, variant = 'card', className = '', style }) {
  const uid = useId().replace(/:/g, '')
  const cfg = VARIANTS[variant] ?? VARIANTS.card
  const BOX = { w: cfg.w, h: cfg.h }

  const { nodes, edges } = useMemo(() => {
    const rand = seededRandom(seed * 2654435761)

    /* Jittered lattice rather than pure random: pure random clumps and reads as
       noise, a lattice reads as a network. */
    const cols = Math.ceil(Math.sqrt(cfg.nodes * 1.5))
    const rows = Math.ceil(cfg.nodes / cols)
    const built = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (built.length >= cfg.nodes) break
        const cellW = BOX.w / cols
        const cellH = BOX.h / rows
        built.push({
          x: c * cellW + cellW * (0.15 + rand() * 0.7),
          y: r * cellH + cellH * (0.15 + rand() * 0.7),
          // A minority are drawn as open rings — the visual rhyme with the dashed
          // vacancy rings used wherever real people would otherwise be.
          open: rand() > 0.78,
          r: cfg.r[0] + rand() * cfg.r[1],
        })
      }
    }

    const links = []
    for (let i = 0; i < built.length; i++) {
      for (let j = i + 1; j < built.length; j++) {
        const dx = built[i].x - built[j].x
        const dy = built[i].y - built[j].y
        if (Math.hypot(dx, dy) < cfg.linkDist) links.push([i, j])
      }
    }

    return { nodes: built, edges: links }
  }, [seed, cfg, BOX.w, BOX.h])

  return (
    <div className={`plate ${className}`} style={style} aria-hidden="true">
      <svg
        className="plate__svg"
        viewBox={`0 0 ${BOX.w} ${BOX.h}`}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id={`plate-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--wash-hi)" />
            <stop offset="46%" stopColor="var(--wash-mid)" />
            <stop offset="100%" stopColor="var(--wash-deep)" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width={BOX.w} height={BOX.h} fill={`url(#plate-${uid})`} />

        <g opacity={cfg.opacity}>
          <g stroke="var(--on-wash-line)" strokeWidth={cfg.stroke} opacity="0.45">
            {edges.map(([i, j], k) => (
              <line key={k} x1={nodes[i].x} y1={nodes[i].y} x2={nodes[j].x} y2={nodes[j].y} />
            ))}
          </g>

          <g>
            {nodes.map((n, i) =>
              n.open ? (
                <circle
                  key={i}
                  cx={n.x}
                  cy={n.y}
                  r={n.r * 1.5}
                  fill="none"
                  stroke="var(--on-wash-2)"
                  strokeWidth={cfg.stroke * 1.2}
                />
              ) : (
                <circle key={i} cx={n.x} cy={n.y} r={n.r} fill="var(--on-wash-2)" />
              )
            )}
          </g>
        </g>
      </svg>
    </div>
  )
}
