import { useState } from 'react'
import Asterisk from './common/Asterisk.jsx'
import RevealOnScroll from './common/RevealOnScroll.jsx'
import { CONFIG } from '../config.js'

/* The four steps, on a hairline rail.

   Steps two and four carry the escrow and refund language, gated on
   CONFIG.REFUND_ON_REFUSE. That flag is FILLED because it is a founder-declared
   rule rather than data — and it is the rule that makes a paid request rational.
   Without a refund on refusal, nobody sends a second one. */

const STEPS = [
  {
    n: '01',
    title: 'Find the room',
    body: 'Browse by network, tier and channel. Every listing says how the person knows that network and what they can actually do.',
  },
  {
    n: '02',
    title: 'Ask, with the fee attached',
    body: 'Write the context. The fee is held, not paid — it is what makes the request worth reading.',
    refundNote: 'Held, not sent.',
  },
  {
    n: '03',
    title: 'They accept, or they do not',
    body: 'The answer is theirs. Refusing costs them nothing and takes one tap.',
  },
  {
    n: '04',
    title: 'The introduction, or your money back',
    body: 'Accepted, the intro happens on the channel you chose. Refused or ignored past the window, the fee returns to you in full.',
    refundNote: 'Refunded on refusal and on expiry.',
  },
]

export default function HowItWorks() {
  const showRefund = CONFIG.REFUND_ON_REFUSE === true

  /* Unlike the tier ladder this is a SEQUENCE, not a pick-one — so selecting a
     step reads as walking the flow rather than choosing between options. Starts
     on 01 for the same reason the ladder starts on Open: the section should look
     settled at rest, not blank. */
  const [active, setActive] = useState(STEPS[0].n)

  return (
    <section className="section" id="how">
      <RevealOnScroll>
        <div className="section__head">
          <span className="label">
            <Asterisk size={10} /> How it works
          </span>
          <h2 className="section__title">
            Four steps, and a <em>refund</em> at the end of two of them
          </h2>
        </div>

        {/* Still an <ol> — the order is meaningful, and it stays meaningful to a
            screen reader whatever the styling does. */}
        <ol className="steps">
          {STEPS.map((s) => (
            <li className="step" key={s.n}>
              <button
                type="button"
                className={`step__btn ${active === s.n ? 'is-active' : ''}`}
                onClick={() => setActive(s.n)}
                aria-pressed={active === s.n}
              >
                <span className="step__n label">{s.n}</span>
                <h3 className="step__title">{s.title}</h3>
                <p className="step__body">{s.body}</p>
                {showRefund && s.refundNote && (
                  <span className="step__note label">{s.refundNote}</span>
                )}
              </button>
            </li>
          ))}
        </ol>
      </RevealOnScroll>
    </section>
  )
}
