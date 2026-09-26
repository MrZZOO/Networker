import Asterisk from '../common/Asterisk.jsx'
import { NETWORKS, OTHER_NETWORK, CUSTOM_NETWORK_MAX } from '../../lib/networks.js'
import { TIERS } from '../../lib/tiers.js'
import { CHANNELS } from '../../lib/channels.js'
import { LIMITS } from '../../lib/validate.js'

/* One rung of the ladder.

   The two long fields are the ones that carry the product, so their labels ask the
   question rather than naming the field — "How do you know them?" gets a better
   answer than "Provenance". */
export default function OfferFields({ offer, index, errors, onChange, onRemove, canRemove }) {
  const set = (patch) => onChange({ ...offer, ...patch })
  const err = (f) => errors[`offers.${index}.${f}`]

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

      <div className="field-row">
        <label className="field">
          <span className="field__label label">Which network?</span>
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
          <span className="field__label label">Which tier?</span>
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
          <span className="field__label label">Name it</span>
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
        <span className="field__label label">How do you know them?</span>
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
        <span className="field__label label">What introduction can you actually make?</span>
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
          <span className="field__label label">Your fee</span>
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
          <span className="field__label label">Which channels do you open?</span>
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
