import Asterisk from './Asterisk.jsx'
import Pill from './Pill.jsx'
import { intakeTarget } from '../../lib/intake.js'

/* The open-call state.

   This is the component the whole plan turns on. An empty state that is a missing
   div reads as a bug; an empty state that is deliberately composed reads as a
   product decision. So this occupies the same grid, with the same card dimensions
   and the same radius, as a populated directory would.

   The dashed "open slot" cards do the heavy lifting: they are visibly an ABSENCE,
   which is the truth, and they claim nothing. No invented profiles, no greyed-out
   examples, no stock faces. */
export default function EmptyState({ slots = 3 }) {
  const intake = intakeTarget()

  return (
    <div className="empty">
      <div className="empty__card">
        <Asterisk size={22} strokeWidth={1.4} />
        <h3 className="empty__title">The directory is open, and empty</h3>
        <p className="empty__body">
          No networks are listed yet. The first people to list set the market&rsquo;s
          prices. There are no example profiles here, because inventing them would
          mean inventing people.
        </p>
        <Pill variant="ink" to={intake.to}>
          <Asterisk size={12} />
          List your network
        </Pill>
      </div>

      <div className="empty__slots" aria-hidden="true">
        {Array.from({ length: slots }, (_, i) => (
          <div className="slot" key={i}>
            <span className="slot__plus">+</span>
            <span className="slot__label label">Open slot</span>
          </div>
        ))}
      </div>
    </div>
  )
}
