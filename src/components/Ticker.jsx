import { CONFIG } from '../config.js'

/* The marquee.

   Every item is PRODUCT SPEC, not market state — rules the platform enforces,
   which are true on day one and stay true whether there are 0 networks or 500.
   A ticker of invented trades would be the single most dishonest thing on the
   page, and it is exactly what this genre tempts you into.

   Popeye does the same: seven static facts, and the one genuinely live number
   gets its own colour so it reads as different in kind. */

const FACTS = [
  'list the rooms you are already in',
  'you set the fee · you can refuse anything',
  'refused or ignored → refunded in full',
  'linkedin · x · telegram · in person',
  'the fee is the filter',
  'seven networks · or name your own',
  'four tiers · some of them free',
]

export default function Ticker() {
  const items = [...FACTS]

  /* A real count earns the money colour. Absent, it simply does not appear —
     never "0 networks listed" dressed up as traction. */
  if (typeof CONFIG.LISTER_COUNT === 'number' && CONFIG.LISTER_COUNT > 0) {
    items.push(`${CONFIG.LISTER_COUNT} networks open right now`)
  }

  /* Duplicated once so translateX(-50%) loops seamlessly. */
  const track = [...items, ...items]

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {track.map((text, i) => (
          <span
            key={i}
            className={`marquee__item${text.includes('networks open') ? ' marquee__item--money' : ''}`}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
