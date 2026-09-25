import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Asterisk from './common/Asterisk.jsx'
import Pill from './common/Pill.jsx'
import { CONFIG } from '../config.js'
import { intakeTarget } from '../lib/intake.js'

/* The floating pill nav.

   Not a bar — a transparent full-width row holding three independent pill groups on
   the paper ground, exactly as the reference does it. Getting these right is the
   first checkpoint of the whole build: if the pills read as a bar, everything
   downstream reads wrong too. */

const LINKS = [
  { id: 'networks', label: 'Networks', href: '#networks' },
  { id: 'tiers', label: 'Tiers', href: '#tiers' },
  { id: 'how', label: 'How it works', href: '#how' },
]

function DotGrid() {
  return (
    <span className="dotgrid" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <circle cx="12" cy="12" r="11" fill="var(--card)" />
        {[
          [9, 9],
          [15, 9],
          [9, 15],
          [15, 15],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.7" fill="var(--ink)" />
        ))}
      </svg>
    </span>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const intake = intakeTarget()

  // Close the sheet on route change and on Escape — same behaviour as the other
  // frontends, so the muscle memory carries across projects.
  useEffect(() => setOpen(false), [pathname, hash])
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="nav">
      <div className="nav__row">
        <Link className="navpill navpill--brand" to="/" aria-label={`${CONFIG.NAME} home`}>
          <Asterisk size={16} />
          <span className="navpill__word">{CONFIG.NAME}</span>
        </Link>

        <nav className="navpill navpill--group" aria-label="Sections">
          {LINKS.map((l) => (
            <a key={l.id} className="navpill__item label" href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav__right">
          <button
            className="navpill navpill--menu"
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="nav-sheet"
          >
            <span className="label">Menu</span>
            <DotGrid />
          </button>

          <Pill variant="white" to={intake.to} className="nav__cta">
            <Asterisk size={12} />
            List your network
          </Pill>
        </div>
      </div>

      {open && (
        <div className="nav__sheet" id="nav-sheet">
          {LINKS.map((l) => (
            <a key={l.id} className="nav__sheet-link" href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <Link className="nav__sheet-link nav__sheet-link--cta" to={intake.to}>
            {intake.label}
          </Link>
        </div>
      )}
    </header>
  )
}
