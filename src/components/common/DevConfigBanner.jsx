import { useState } from 'react'
import useConfigGaps from '../../hooks/useConfigGaps.js'

/* DEV ONLY. Lists the CONFIG slots still carrying no real value.

   This is the gate's conscience: it makes an unfilled claim visible while building,
   so nobody is tempted to type a plausible number into a component just to make a
   card look finished. `import.meta.env.DEV` is compile-time, so this whole
   component is dropped from the production bundle — verify that by running
   `npm run preview` and confirming the banner is gone. */
export default function DevConfigBanner() {
  const gaps = useConfigGaps()
  const [open, setOpen] = useState(false)

  if (!import.meta.env.DEV || gaps.length === 0) return null

  return (
    <div className="devbanner">
      <button
        className="devbanner__toggle"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {gaps.length} empty config {gaps.length === 1 ? 'slot' : 'slots'}
      </button>
      {open && (
        <ul className="devbanner__list">
          {gaps.map((slot) => (
            <li key={slot}>{slot}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
