import Asterisk from './common/Asterisk.jsx'
import RevealOnScroll from './common/RevealOnScroll.jsx'
import { NETWORKS, OTHER_NETWORK } from '../lib/networks.js'
import { CHANNELS } from '../lib/channels.js'

/* The curated network list and the four channels.

   Both are product spec, not market state — they describe what the thing supports,
   so they are safe to render in full on day one.

   The "Other" chip is dashed rather than solid: it is an opening, not a category,
   and it should read that way. */

function ChannelIcon({ paths }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
      {paths.map((d) => (
        <path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}

export default function NetworkStrip() {
  return (
    <section className="section">
      <RevealOnScroll>
        <div className="section__head">
          <span className="label">
            <Asterisk size={10} /> What people open
          </span>
          <h2 className="section__title">
            The networks worth <em>asking</em> for
          </h2>
          <p className="section__lede">
            Pick the network you can genuinely reach, say how you know it, and say
            what an introduction from you actually gets someone. If yours is not
            here, name it.
          </p>
        </div>

        <div className="netgrid">
          {NETWORKS.map((n) => (
            <div className="netcard" key={n.id}>
              <span className="netcard__label">{n.label}</span>
              <span className="netcard__who">{n.who}</span>
            </div>
          ))}
          <div className="netcard netcard--other">
            <span className="netcard__label">{OTHER_NETWORK.label}</span>
            <span className="netcard__who">{OTHER_NETWORK.who}</span>
          </div>
        </div>

        <div className="channels">
          <span className="label channels__caption">
            The lister chooses which channels they open
          </span>
          <div className="channels__row">
            {CHANNELS.map((c) => (
              <span className="chip" key={c.id}>
                <ChannelIcon paths={c.paths} />
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  )
}
