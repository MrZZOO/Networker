import useReveal from '../hooks/useReveal.js'
import Hero from '../components/Hero.jsx'
import Ticker from '../components/Ticker.jsx'
import LiveStats from '../components/LiveStats.jsx'
import Floor from '../components/Floor.jsx'
import FeatureBand from '../components/FeatureBand.jsx'
import NetworkStrip from '../components/NetworkStrip.jsx'
import TierLadder from '../components/TierLadder.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import CTABand from '../components/CTABand.jsx'

/* Launchpad running order: hero → ticker → live stats → the floor, then the
   explanation. A launchpad leads with the market and explains itself second;
   a brochure does the reverse. */
export default function Home() {
  useReveal()

  return (
    <main>
      <Hero />
      <Ticker />
      <LiveStats />
      {/* Nothing has launched, so there is nothing to buy. The floor says so. */}
      <Floor listings={[]} />
      <TierLadder />
      <HowItWorks />
      <NetworkStrip />
      <FeatureBand />
      <CTABand />
    </main>
  )
}
