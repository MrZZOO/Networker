import { useState } from 'react'
import Asterisk from './common/Asterisk.jsx'
import RevealOnScroll from './common/RevealOnScroll.jsx'
import { CONFIG } from '../config.js'

/* Four steps. Steps two and four carry the escrow and refund language, gated on
   CONFIG.REFUND_ON_REFUSE — a founder-declared rule, not data, and the rule that
   makes a paid request rational. Without a refund nobody sends a second one. */

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
    note: 'Held, not sent',
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
    note: 'Refunded on refusal and expiry',
  },
]

export default function HowItWorks() {
  const showRefund = CONFIG.REFUND_ON_REFUSE === true
  const [active, setActive] = useState(STEPS[0].n)

  return (
    <section className="section" id="how">
      <div className="container">
        <RevealOnScroll>
          <div className="section-head">
            <span className="eyebrow">
              <Asterisk size={10} /> How it works
            </span>
            <h2 className="display-h2">
              Four steps, and a refund at the end of <span className="grad-text">two</span>
            </h2>
          </div>

          <ol className="steps">
            {STEPS.map((s) => (
              <li className="step" key={s.n}>
                <button
                  type="button"
                  className={`glass step__btn ${active === s.n ? 'is-active' : ''}`}
                  onClick={() => setActive(s.n)}
                  aria-pressed={active === s.n}
                >
                  <span className="step__n">{s.n}</span>
                  <h3 className="step__title">{s.title}</h3>
                  <p className="step__body">{s.body}</p>
                  {showRefund && s.note && <span className="step__note">{s.note}</span>}
                </button>
              </li>
            ))}
          </ol>
        </RevealOnScroll>
      </div>
    </section>
  )
}
