import Asterisk from './common/Asterisk.jsx'
import { CONFIG } from '../config.js'
import { isOpenCall } from '../lib/intake.js'

const SOCIAL_LABELS = { x: 'X', telegram: 'Telegram', linkedin: 'LinkedIn' }

export default function Footer() {
  // Only non-null socials render — an empty object renders no row at all rather
  // than a row of dead links.
  const socials = Object.entries(CONFIG.SOCIALS ?? {}).filter(([, v]) => v)

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <span className="footer__word">
            <Asterisk size={22} strokeWidth={1.5} style={{ display: 'inline-block', verticalAlign: '-2px', marginRight: 10 }} />
            {CONFIG.NAME}
          </span>
          {isOpenCall() && (
            <p className="footer__note">
              {CONFIG.NAME} is pre-launch. No networks are listed yet, no
              introductions have been made, and no fees are being collected.
            </p>
          )}
        </div>

        <div className="footer__links">
          <a href="#roster">The roster</a>
          <a href="#tiers">Tiers</a>
          <a href="#how">How it works</a>
          {socials.map(([key, href]) => (
            <a key={key} href={href} target="_blank" rel="noreferrer noopener">
              {SOCIAL_LABELS[key] ?? key} ↗
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
