import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Asterisk from './common/Asterisk.jsx'
import { CONFIG } from '../config.js'
import { intakeTarget } from '../lib/intake.js'

const LINKS = [
  { id: 'roster', label: 'The roster', href: '#roster' },
  { id: 'tiers', label: 'Tiers', href: '#tiers' },
  { id: 'how', label: 'How it works', href: '#how' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const intake = intakeTarget()

  useEffect(() => setOpen(false), [pathname, hash])
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="nav">
      <div className="container">
        <div className="nav__inner">
          <Link className="nav__mark" to="/" aria-label={`${CONFIG.NAME} home`}>
            <Asterisk size={18} />
            <span className="nav__word">{CONFIG.NAME}</span>
            {/* A machine-stamped label beside a human name — the same device as
                Spinach's yellow RWA chip. */}
            <span className="nav__tag">BETA</span>
          </Link>

          <nav className="nav__links" aria-label="Sections">
            {LINKS.map((l) => (
              <a key={l.id} className="nav__link" href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="nav__right">
            <Link className="btn btn--amber btn--sm nav__cta" to={intake.to}>
              Launch your network
            </Link>
            <button
              className="nav__burger"
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="nav-menu"
              aria-label="Menu"
            >
              ☰
            </button>
          </div>
        </div>

        <div className={`nav__menu ${open ? 'is-open' : ''}`} id="nav-menu">
          {LINKS.map((l) => (
            <a key={l.id} className="nav__link" href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <Link className="btn btn--amber" to={intake.to} style={{ marginTop: 8 }}>
            Launch your network
          </Link>
        </div>
      </div>
    </header>
  )
}
