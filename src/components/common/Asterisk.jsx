import { polarPoint } from '../../lib/geometry.js'

/* The brand mark: a six-point asterisk, three lines through the origin at 0°, 60°
   and 120°.

   Drawn as SVG rather than the "✳" character on purpose — a text asterisk
   substitutes to six visibly different shapes across Windows, macOS and Android,
   which would wreck the mark. currentColor + round caps means it inherits from
   whatever pill it sits in, so one component serves the brand pill, the tags, the
   feature headings, the CTAs and the favicon. */
export default function Asterisk({ size = 14, strokeWidth = 1.6, className, style }) {
  const lines = [0, 60, 120].map((deg) => {
    const a = polarPoint(12, 12, 9, deg)
    const b = polarPoint(12, 12, 9, deg + 180)
    return { a, b, deg }
  })

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ flexShrink: 0, display: 'block', ...style }}
      aria-hidden="true"
      focusable="false"
    >
      {lines.map(({ a, b, deg }) => (
        <line
          key={deg}
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}
