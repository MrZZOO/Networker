import useReveal from '../hooks/useReveal.js'
import Hero from '../components/Hero.jsx'
import FeatureBand from '../components/FeatureBand.jsx'
import NetworkStrip from '../components/NetworkStrip.jsx'
import TierLadder from '../components/TierLadder.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import DirectoryPreview from '../components/DirectoryPreview.jsx'
import CTABand from '../components/CTABand.jsx'

export default function Home() {
  useReveal()

  return (
    <main className="page">
      <Hero />
      <FeatureBand />
      <NetworkStrip />
      <TierLadder />
      <HowItWorks />
      {/* No listings exist and there is no honest way to invent any, so the grid
          renders its open-call state. */}
      <DirectoryPreview listings={[]} />
      <CTABand />
    </main>
  )
}
