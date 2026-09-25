import { CONFIG } from '../config.js'

/* Where "List your network" goes.

   It now goes to the real form at /list, always. The form is what knows whether
   submissions are wired up (see lib/applications.js) and says so plainly — that is
   a better place for the truth than a disabled nav button, because someone can at
   least read what will be asked of them.

   The socials fallback stays for the footer and for anyone who would rather just
   message a human. */
export function intakeTarget() {
  return { to: '/list', label: 'List your network' }
}

/* A direct human channel, when one is configured. Null renders nothing. */
export function contactTarget() {
  const { telegram, x } = CONFIG.SOCIALS ?? {}
  if (telegram) return { href: telegram, label: 'Message on Telegram' }
  if (x) return { href: x, label: 'Message on X' }
  if (CONFIG.CONTACT_EMAIL) {
    return {
      href: `mailto:${CONFIG.CONTACT_EMAIL}?subject=${encodeURIComponent('Listing my network')}`,
      label: 'Email us',
    }
  }
  return null
}

/* True while there are no listings — drives the open-call state across the page. */
export function isOpenCall() {
  return CONFIG.MARKET_STATE !== 'live'
}
