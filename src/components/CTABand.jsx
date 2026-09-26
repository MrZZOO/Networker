import { Link } from 'react-router-dom'
import RevealOnScroll from './common/RevealOnScroll.jsx'
import { intakeTarget, isOpenCall } from '../lib/intake.js'

/* The closing band, with the spinning conic border — the one loud effect on the
   page, borrowed from Popeye's CTA.

   "Request an introduction" is DISABLED WITH ITS REASON VISIBLE while the market
   is pre-launch, never hidden. Someone who came here to buy an intro should see
   the door exists and learn when it opens. */
export default function CTABand() {
  const intake = intakeTarget()
  const openCall = isOpenCall()

  return (
    <section className="section">
      <div className="container">
        <RevealOnScroll className="cta-glow">
          <div className="cta-glow__inner">
            <h2 className="display-h2">
              Who can you reach that <span className="grad-text">nobody else</span> can?
            </h2>

            <div className="cta-glow__row">
              <Link className="btn btn--amber" to={intake.to}>
                Launch your network
              </Link>

              <span className="btn-with-reason">
                <span className="btn btn--ghost is-disabled" aria-disabled={openCall}>
                  Request an introduction
                </span>
                {openCall && <span className="btn-reason">Opens when the first networks launch</span>}
              </span>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
