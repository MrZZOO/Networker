import Asterisk from './common/Asterisk.jsx'
import { CONFIG } from '../config.js'
import { isOpenCall } from '../lib/intake.js'

const SOCIAL_LABELS = { x: 'X', telegram: 'Telegram', linkedin: 'LinkedIn' }

export default function Footer() {
  // Only non-null socials render. An empty object renders no row at all rather
  // than a row of dead links.
  const socials = Object.entries(CONFIG.SOCIALS ?? {}).filter(([, v]) => v)

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__mark">
          <Asterisk size={26} strokeWidth={1.4} />
          <span className="footer__word">{CONFIG.NAME}</span>
        </div>

        <div className="footer__cols">
          <nav className="footer__col" aria-label="Sections">
            <span className="label footer__coltitle">Page</span>
            <a href="#networks">Networks</a>
            <a href="#tiers">Tiers</a>
            <a href="#how">How it works</a>
            <a href="#directory">Directory</a>
          </nav>

          {socials.length > 0 && (
            <nav className="footer__col" aria-label="Social">
              <span className="label footer__coltitle">Elsewhere</span>
              {socials.map(([key, href]) => (
                <a key={key} href={href} target="_blank" rel="noreferrer noopener">
                  {SOCIAL_LABELS[key] ?? key}
                </a>
              ))}
            </nav>
          )}
        </div>

        {/* The honest disclosure. It stays until there is something true to replace
            it with, and it is deliberately in the footer of every page rather than
            buried in a legal link. */}
        {isOpenCall() && (
          <p className="footer__disclosure">
            {CONFIG.NAME} is pre-launch. No networks are listed yet, no introductions
            have been made, and no fees are being collected.
          </p>
        )}
      </div>
    </footer>
  )
}
