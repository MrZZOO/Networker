import useReveal from '../hooks/useReveal.js'
import Hero from '../components/Hero.jsx'
import Ticker from '../components/Ticker.jsx'
import LiveStats from '../components/LiveStats.jsx'
import Roster from '../components/Roster.jsx'
import FeatureBand from '../components/FeatureBand.jsx'
import NetworkStrip from '../components/NetworkStrip.jsx'
import TierLadder from '../components/TierLadder.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import CTABand from '../components/CTABand.jsx'

/* Launchpad running order: hero → ticker → live stats → the roster, then the
   explanation. A launchpad leads with the market and explains itself second;
   a brochure does the reverse. */
export default function Home() {
  useReveal()

  return (
    <main>
      <Hero />
      <Ticker />
      <LiveStats />
      {/* No listings exist and there is no honest way to invent any, so the
          roster renders its numbered unclaimed slots. */}
      <Roster listings={[]} />
      <TierLadder />
      <HowItWorks />
      <NetworkStrip />
      <FeatureBand />
      <CTABand />
    </main>
  )
}
