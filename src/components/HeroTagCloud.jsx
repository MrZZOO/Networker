import Asterisk from './common/Asterisk.jsx'

/* The cloud of outlined pill tags, bottom-right of the hero.

   Tags describe the PRODUCT, not its traction — positioning statements, which are
   the same category of claim as a declared fee split and equally safe to ship on
   day one.

   Exactly one is filled ink, as in the reference. That single dark pill is what
   gives the cloud a focal point; two would fight.

   Register note: "Signal only" replaces the obvious "intros, not spam". Naming spam
   at all drags the page down a register, and the supply side here is people who
   already get more inbound than they can read. */
const TAGS = [
  { text: 'By introduction', filled: true },
  { text: 'Any field', filled: false },
  { text: 'Priced by you', filled: false },
  { text: 'Discreet', filled: false },
  { text: 'Signal only', filled: false },
]

export default function HeroTagCloud() {
  return (
    <div className="tagcloud">
      {TAGS.map((t) => (
        <span key={t.text} className={`tag ${t.filled ? 'tag--filled' : ''}`}>
          {t.text}
          <Asterisk size={9} strokeWidth={1.8} />
        </span>
      ))}
    </div>
  )
}
