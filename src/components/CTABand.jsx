import Asterisk from './common/Asterisk.jsx'
import Pill from './common/Pill.jsx'
import RevealOnScroll from './common/RevealOnScroll.jsx'
import { intakeTarget, isOpenCall } from '../lib/intake.js'

/* The closing band.

   "Request an intro" is DISABLED WITH ITS REASON VISIBLE while the market is in
   open-call — never hidden. Someone who came here to buy an introduction should see
   that the door exists and learn when it opens, not find a page with no buyer path
   on it at all. */
export default function CTABand() {
  const intake = intakeTarget()
  const openCall = isOpenCall()

  return (
    <section className="section">
      <RevealOnScroll className="cta">
        <h2 className="cta__title">Who can you reach that nobody else can?</h2>

        <div className="cta__row">
          <Pill variant="white" to={intake.to}>
            <Asterisk size={12} />
            List your network
          </Pill>

          <Pill
            variant="wash-outline"
            href={openCall ? undefined : '#directory'}
            disabled={openCall}
            disabledReason={openCall ? 'Opens when the first networks are listed' : null}
          >
            Request an introduction
          </Pill>
        </div>
      </RevealOnScroll>
    </section>
  )
}
