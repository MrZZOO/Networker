/* ─── Geometry for the hero's radial label cluster ───────────────────────────
   The SVG connector lines and the HTML labels are positioned from the SAME angle
   constants, so the two can never drift apart. That is the whole reason this lives
   in its own module rather than inline in the component. */

/* Polar → cartesian, with 0° pointing UP (the usual clock reading) rather than
   right, because the label angles are easier to reason about that way. */
export const polarPoint = (cx, cy, r, deg) => {
  const a = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

/* The three labels, as angles off the circle's LEFT-hand side, ordered top to
   bottom: upper-left, due left, lower-left.

   Left, because in the reference the circular inset sits at the right edge of the
   hero and the labels fan inward toward the headline. Fanning them right would run
   them off the card. */
export const LABEL_ANGLES = [315, 270, 225]

/* Build one elbow polyline: out radially from the circle's edge, then a horizontal
   run to a shared gutter on the right. Returns the points for a <polyline> plus the
   two dot positions and the label anchor.

   cx, cy, r  — the circle in viewBox units
   angle      — degrees, 0 = up
   reach      — how far past the circle edge the radial leg runs
   gutterX    — the shared x every elbow lands on */
export function connector({ cx, cy, r, angle, reach = 54, gutterX }) {
  const start = polarPoint(cx, cy, r + 6, angle)
  const bend = polarPoint(cx, cy, r + reach, angle)
  const end = { x: gutterX, y: bend.y }

  return {
    points: `${start.x},${start.y} ${bend.x},${bend.y} ${end.x},${end.y}`,
    start,
    end,
    /* Label anchor as a percentage of the viewBox, so the HTML label can be
       positioned with left/top and scale with the box instead of being pinned to
       SVG user units. */
    anchorPct: { x: (end.x / 400) * 100, y: (end.y / 400) * 100 },
  }
}

/* A small deterministic PRNG. NetworkPlate needs node positions that differ per
   instance but never re-randomise between renders — a plate that reshuffles on
   every paint reads as a glitch. Seeded by a number, so the same seed is always the
   same plate. */
export function seededRandom(seed) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    s >>>= 0
    return s / 4294967296
  }
}
