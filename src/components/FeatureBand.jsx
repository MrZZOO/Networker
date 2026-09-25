import { useState, useEffect } from 'react'
import Asterisk from './common/Asterisk.jsx'
import Pill from './common/Pill.jsx'
import PhotoCard from './common/PhotoCard.jsx'
import RevealOnScroll from './common/RevealOnScroll.jsx'
import { CONFIG } from '../config.js'

/* The two-column band below the hero.

   Copy register: never instruct the lister, never sell to them, state the market.
   Row three is where the refusal right lives, framed as inbound QUALITY rather than
   as permission to say no — "you can always refuse" reads as reassurance, which
   implies someone might be pressured, which is the wrong problem for this audience. */

const MECHANICS = [
  {
    id: 'rooms',
    title: 'List the rooms you are already in',
    body: 'Name the networks you can genuinely reach, how you know them, and what an introduction from you actually gets someone.',
    floatPhoto: false,
  },
  {
    id: 'price',
    title: 'Price the door, or leave it open',
    body: 'Every network on your ladder carries its own fee. Some of yours can be free. None of it is set by us.',
    floatPhoto: true,
  },
  {
    id: 'qualified',
    title: 'Every request arrives pre-qualified',
    body: 'A fee attached to a request is a filter on who bothers sending one. Take the ones worth taking; the rest refund themselves.',
    floatPhoto: false,
  },
  {
    id: 'channels',
    title: 'Four channels, you choose which are open',
    body: 'LinkedIn, X, Telegram, or in person — set per network, so a warm room stays warm.',
    floatPhoto: false,
  },
  {
    id: 'field',
    title: 'Open to any field',
    body: 'The mechanism does not care what industry you are in. If you can reach people worth reaching, you can list.',
    floatPhoto: false,
  },
]

const GALLERY_SLOTS = 3
/* Derived once so the dots, the cards and the cycle can never disagree. */
const SLOTS = Array.from({ length: GALLERY_SLOTS }, (_, i) => i)
const CYCLE_MS = 2000

export default function FeatureBand() {
  const [active, setActive] = useState(0)
  const images = CONFIG.FEATURE_IMAGES ?? []

  /* The dots promise a carousel, so it has to actually move — otherwise they read
     as broken controls.

     setTimeout keyed on `active` rather than a standing setInterval: each manual
     click restarts the clock, so clicking a dot does not get yanked onward a
     fraction of a second later by a timer that was already most of the way
     through its tick.

     Skipped entirely under prefers-reduced-motion. Content that moves on its own
     is exactly what that setting is asking us not to do, and the dots still work
     by hand. */
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = setTimeout(() => setActive((a) => (a + 1) % GALLERY_SLOTS), CYCLE_MS)
    return () => clearTimeout(id)
  }, [active])

  return (
    <section className="section" id="networks">
      <RevealOnScroll className="band">
        <div className="band__left">
          {MECHANICS.map((m, i) => (
            <div className={`feat-row ${m.floatPhoto ? 'feat-row--photo' : ''}`} key={m.id}>
              <h3 className="feat-row__title">
                <Asterisk size={12} />
                {m.title}
              </h3>
              <p className="feat-row__body">{m.body}</p>
              {m.floatPhoto && (
                /* The gallery takes the first three; this one takes a fourth if
                   there ever is one, so supplying exactly three fills the gallery
                   rather than leaving its last card as a plate. */
                <PhotoCard
                  className="feat-row__card"
                  src={images[3] ?? null}
                  seed={11 + i}
                  ratio="5 / 4"
                />
              )}
            </div>
          ))}
        </div>

        <div className="band__right">
          <h2 className="band__title">
            <span className="band__title-dim">What makes</span>{' '}
            <span className="band__title-ink">{CONFIG.NAME}</span>{' '}
            <span className="band__title-dim">different?</span>
          </h2>

          <Pill variant="ink" href="#how" className="band__cta">
            <Asterisk size={12} />
            Read how it works
          </Pill>

          <div className="band__gallery">
            <div className="band__dots" role="tablist" aria-label="Gallery">
              {SLOTS.map((i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  aria-label={`View ${i + 1} of ${GALLERY_SLOTS}`}
                  className={`band__dot ${active === i ? 'is-active' : ''}`}
                  onClick={() => setActive(i)}
                />
              ))}
            </div>

            <div className="band__cards">
              {SLOTS.map((i) => (
                <PhotoCard
                  key={i}
                  className={`band__card ${active === i ? 'is-active' : ''}`}
                  src={images[i] ?? null}
                  seed={21 + i}
                  ratio="3 / 4"
                />
              ))}
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  )
}
