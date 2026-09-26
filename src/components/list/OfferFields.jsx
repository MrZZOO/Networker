import Asterisk from '../common/Asterisk.jsx'
import { NETWORKS, OTHER_NETWORK, CUSTOM_NETWORK_MAX } from '../../lib/networks.js'
import { TIERS } from '../../lib/tiers.js'
import { CHANNELS } from '../../lib/channels.js'
import { LIMITS, emptyContact } from '../../lib/validate.js'
import { INTRO_LEVELS } from '../../lib/introLevels.js'

/* One rung of the ladder.

   The two long fields are the ones that carry the product, so their labels ask the
   question rather than naming the field — "How do you know them?" gets a better
   answer than "Provenance". */
export default function OfferFields({ offer, index, errors, onChange, onRemove, canRemove }) {
  const set = (patch) => onChange({ ...offer, ...patch })
  const err = (f) => errors[`offers.${index}.${f}`]

  const contacts = offer.contacts ?? []
  const setContact = (i, patch) =>
    set({ contacts: contacts.map((c, j) => (j === i ? { ...c, ...patch } : c)) })
  const addContact = () => set({ contacts: [...contacts, emptyContact()] })
  const removeContact = (i) => set({ contacts: contacts.filter((_, j) => j !== i) })

  const toggleChannel = (id) => {
    const has = offer.channels.includes(id)
    set({ channels: has ? offer.channels.filter((c) => c !== id) : [...offer.channels, id] })
  }

  return (
    <fieldset className="offerfields">
      <legend className="offerfields__legend">
        <Asterisk size={10} /> Network {index + 1}
      </legend>

      {canRemove && (
        <button type="button" className="offerfields__remove" onClick={onRemove}>
          Remove
        </button>
      )}

      {/* WHO IS ACTUALLY BEHIND THIS NETWORK.
          A buyer is not choosing between abstract categories, they are choosing
          between specific doors — so the name, the role and the strength of the
          introduction are the three things that let them price one. */}
      <div className="contacts">
        <div className="contacts__head">
          <span className="field__label">Who you can reach</span>
          <span className="field__hint">
            Named publicly. Payment only settles once the introduction is actually
            made, so there is nothing to gain from listing someone you cannot reach.
          </span>
        </div>

        {contacts.map((c, ci) => {
          const cerr = (f) => errors[`offers.${index}.contacts.${ci}.${f}`]
          return (
            <div className="contact" key={ci}>
              <div className="contact__grid">
                <label className="field">
                  <span className="field__label">Name</span>
                  <input
                    className="field__input"
                    type="text"
                    maxLength={LIMITS.contactName}
                    value={c.name}
                    onChange={(e) => setContact(ci, { name: e.target.value })}
                    placeholder="Jane Okafor"
                  />
                  {cerr('name') && <span className="field__err">{cerr('name')}</span>}
                </label>

                <label className="field">
                  <span className="field__label">Role</span>
                  <input
                    className="field__input"
                    type="text"
                    maxLength={LIMITS.contactRole}
                    value={c.role}
                    onChange={(e) => setContact(ci, { role: e.target.value })}
                    placeholder="Partner, Ridgeline Capital"
                  />
                  {cerr('role') && <span className="field__err">{cerr('role')}</span>}
                </label>

                <label className="field">
                  <span className="field__label">What you can offer</span>
                  <select
                    className="field__input"
                    value={c.level}
                    onChange={(e) => setContact(ci, { level: e.target.value })}
                  >
                    <option value="">Select…</option>
                    {INTRO_LEVELS.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                  {cerr('level') && <span className="field__err">{cerr('level')}</span>}
                </label>
              </div>

              {contacts.length > 1 && (
                <button type="button" className="contact__remove" onClick={() => removeContact(ci)}>
                  Remove
                </button>
              )}
            </div>
          )
        })}

        {err('contacts') && <span className="field__err">{err('contacts')}</span>}

        {contacts.length < LIMITS.maxContacts && (
          <button type="button" className="btn btn--ghost btn--sm contacts__add" onClick={addContact}>
            <Asterisk size={11} /> Add another person
          </button>
        )}
      </div>

      <div className="field-row">
        <label className="field">
          <span className="field__label">Which network?</span>
          <select
            className="field__input"
            value={offer.network}
            onChange={(e) => set({ network: e.target.value })}
          >
            <option value="">Select…</option>
            {NETWORKS.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
            <option value={OTHER_NETWORK.id}>{OTHER_NETWORK.label} — name your own</option>
          </select>
          {err('network') && <span className="field__err">{err('network')}</span>}
        </label>

        <label className="field">
          <span className="field__label">Which tier?</span>
          <select
            className="field__input"
            value={offer.tier}
            onChange={(e) => set({ tier: e.target.value })}
          >
            <option value="">Select…</option>
            {TIERS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label} — {t.who}
              </option>
            ))}
          </select>
          {err('tier') && <span className="field__err">{err('tier')}</span>}
        </label>
      </div>

      {offer.network === OTHER_NETWORK.id && (
        <label className="field">
          <span className="field__label">Name it</span>
          <input
            className="field__input"
            type="text"
            maxLength={CUSTOM_NETWORK_MAX}
            value={offer.customNetwork}
            onChange={(e) => set({ customNetwork: e.target.value })}
            placeholder="e.g. Formula 1 paddock, Nairobi fintech founders"
          />
          {err('customNetwork') && <span className="field__err">{err('customNetwork')}</span>}
        </label>
      )}

      <label className="field">
        <span className="field__label">How do you know them?</span>
        <textarea
          className="field__input field__input--area"
          rows={3}
          maxLength={LIMITS.provenance}
          value={offer.provenance}
          onChange={(e) => set({ provenance: e.target.value })}
          placeholder="Partner at ___ 2019–2024, still in the investment-committee channel."
        />
        <span className="field__hint">
          The claim someone is judging. Specific beats impressive.
        </span>
        {err('provenance') && <span className="field__err">{err('provenance')}</span>}
      </label>

      <label className="field">
        <span className="field__label">What introduction can you actually make?</span>
        <textarea
          className="field__input field__input--area"
          rows={2}
          maxLength={LIMITS.deliverable}
          value={offer.deliverable}
          onChange={(e) => set({ deliverable: e.target.value })}
          placeholder="A warm intro to a partner — not an associate, not a form."
        />
        <span className="field__hint">
          This is what the fee buys, and what a refund is measured against.
        </span>
        {err('deliverable') && <span className="field__err">{err('deliverable')}</span>}
      </label>

      <div className="field-row">
        <div className="field">
          <span className="field__label">Your fee</span>
          <div className="feerow">
            <button
              type="button"
              className={`toggle ${offer.free ? 'is-on' : ''}`}
              onClick={() => set({ free: !offer.free })}
              aria-pressed={offer.free}
            >
              Free
            </button>
            <input
              className="field__input field__input--fee"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              disabled={offer.free}
              value={offer.free ? '' : offer.feeAmount}
              onChange={(e) => set({ feeAmount: e.target.value })}
              placeholder="250"
              aria-label="Fee amount in USD"
            />
            <span className="feerow__unit">USD</span>
          </div>
          <span className="field__hint">
            Quoted in USD — the platform token has no ticker yet, so pricing in it
            would be pricing in nothing.
          </span>
          {err('feeAmount') && <span className="field__err">{err('feeAmount')}</span>}
        </div>

        <div className="field">
          <span className="field__label">Which channels do you open?</span>
          <div className="checkrow">
            {CHANNELS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`toggle ${offer.channels.includes(c.id) ? 'is-on' : ''}`}
                onClick={() => toggleChannel(c.id)}
                aria-pressed={offer.channels.includes(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
          {err('channels') && <span className="field__err">{err('channels')}</span>}
        </div>
      </div>

    </fieldset>
  )
}
