import { useState } from 'react'
import { Link } from 'react-router-dom'
import Asterisk from '../components/common/Asterisk.jsx'
import Pill from '../components/common/Pill.jsx'
import OfferFields from '../components/list/OfferFields.jsx'
import { CONFIG } from '../config.js'
import { emptyApplication, emptyOffer, validateApplication, toRecord, LIMITS } from '../lib/validate.js'
import { submitApplication, submissionsEnabled } from '../lib/applications.js'

/* The listing application.

   An application, not a publication: nothing here goes live until it is reviewed.
   On a marketplace whose entire value is signal quality, an open unmoderated form
   fills the directory with noise, and a public directory is hard to un-publish.
   Reviewing also means no user accounts in v1 — nobody needs a password to ask. */

function Done({ onAgain }) {
  return (
    <div className="applied">
      <Asterisk size={26} strokeWidth={1.4} />
      <h1 className="applied__title">Application received</h1>
      <p className="applied__body">
        Every application is read by a person before anything goes live. If it is a
        fit, we will email you to confirm the details and agree how your listing
        reads before it is published. Nothing appears publicly until you have seen it.
      </p>
      <div className="applied__row">
        <Pill variant="ink" to="/">
          Back to the site
        </Pill>
        <Pill variant="outline" onClick={onAgain}>
          Submit another
        </Pill>
      </div>
    </div>
  )
}

export default function ListYourNetwork() {
  const [app, setApp] = useState(emptyApplication)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(null)
  const [done, setDone] = useState(false)

  const live = submissionsEnabled()

  const setOffer = (i, next) => {
    setApp((a) => ({ ...a, offers: a.offers.map((o, j) => (j === i ? next : o)) }))
  }
  const addOffer = () => {
    setApp((a) => ({ ...a, offers: [...a.offers, emptyOffer()] }))
  }
  const removeOffer = (i) => {
    setApp((a) => ({ ...a, offers: a.offers.filter((_, j) => j !== i) }))
  }

  const reset = () => {
    setApp(emptyApplication())
    setErrors({})
    setTouched(false)
    setFailed(null)
    setDone(false)
  }

  async function onSubmit(e) {
    e.preventDefault()
    setTouched(true)
    setFailed(null)

    const found = validateApplication(app)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      document.querySelector('.field__err')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    // Honeypot: a real person never sees this field, so anything in it is a bot.
    // Report success rather than an error — telling a bot it was caught just
    // teaches whoever wrote it to fix it.
    if (app.website.trim()) {
      setDone(true)
      return
    }

    setBusy(true)
    try {
      await submitApplication(toRecord(app))
      setDone(true)
      window.scrollTo(0, 0)
    } catch (err) {
      setFailed(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (done) return <main className="page page--form"><Done onAgain={reset} /></main>

  return (
    <main className="page page--form">
      <div className="formwrap">
        <Link className="formwrap__back label" to="/">
          ← {CONFIG.NAME}
        </Link>

        <header className="formhead">
          <span className="label">
            <Asterisk size={10} /> List your network
          </span>
          <h1 className="formhead__title">
            Who can you reach that <em>nobody else</em> can?
          </h1>
          <p className="formhead__lede">
            One application, as many networks as you want to open. Every one is read
            by a person, and nothing is published until you have seen how it reads.
          </p>
        </header>

        {!live && (
          /* Never a form that silently swallows what someone typed. */
          <div className="notice">
            <strong className="notice__title">Applications are not open yet.</strong>
            <span>
              You can fill this in to see what is asked, but the submit button stays
              disabled until the intake is live.
            </span>
          </div>
        )}

        <form className="form" onSubmit={onSubmit} noValidate>
          <fieldset className="offerfields">
            <legend className="offerfields__legend label">
              <Asterisk size={10} /> You
            </legend>

            <div className="field-row">
              <label className="field">
                <span className="field__label label">Your name</span>
                <input
                  className="field__input"
                  type="text"
                  maxLength={LIMITS.displayName}
                  value={app.displayName}
                  onChange={(e) => setApp({ ...app, displayName: e.target.value })}
                  autoComplete="name"
                />
                {errors.displayName && <span className="field__err">{errors.displayName}</span>}
              </label>

              <label className="field">
                <span className="field__label label">Email</span>
                <input
                  className="field__input"
                  type="email"
                  maxLength={LIMITS.email}
                  value={app.email}
                  onChange={(e) => setApp({ ...app, email: e.target.value })}
                  autoComplete="email"
                />
                <span className="field__hint label">
                  Never published. It is how we reach you about the listing.
                </span>
                {errors.email && <span className="field__err">{errors.email}</span>}
              </label>
            </div>

            <label className="field">
              <span className="field__label label">One line on you</span>
              <input
                className="field__input"
                type="text"
                maxLength={LIMITS.headline}
                value={app.headline}
                onChange={(e) => setApp({ ...app, headline: e.target.value })}
                placeholder="Founder, two exits. Ten years in infrastructure."
              />
              {errors.headline && <span className="field__err">{errors.headline}</span>}
            </label>

            <label className="field">
              <span className="field__label label">A handle, if you want one shown</span>
              <input
                className="field__input"
                type="text"
                maxLength={LIMITS.handle}
                value={app.handle}
                onChange={(e) => setApp({ ...app, handle: e.target.value })}
                placeholder="@yourhandle"
              />
              {errors.handle && <span className="field__err">{errors.handle}</span>}
            </label>
          </fieldset>

          {app.offers.map((offer, i) => (
            <OfferFields
              key={i}
              offer={offer}
              index={i}
              errors={errors}
              onChange={(next) => setOffer(i, next)}
              onRemove={() => removeOffer(i)}
              canRemove={app.offers.length > 1}
            />
          ))}

          {errors.offers && <span className="field__err">{errors.offers}</span>}

          {app.offers.length < LIMITS.maxOffers && (
            <Pill variant="outline" onClick={addOffer} className="form__add">
              <Asterisk size={11} />
              Add another network
            </Pill>
          )}

          {/* Honeypot. Hidden from sight and from screen readers; bots fill it. */}
          <div className="hp" aria-hidden="true">
            <label>
              Website
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={app.website}
                onChange={(e) => setApp({ ...app, website: e.target.value })}
              />
            </label>
          </div>

          {failed && (
            <div className="notice notice--bad" role="alert">
              <strong className="notice__title">Not submitted.</strong>
              <span>{failed}</span>
            </div>
          )}

          <div className="form__foot">
            <Pill
              variant="ink"
              onClick={onSubmit}
              disabled={!live || busy}
              disabledReason={!live ? 'The intake is not live yet' : null}
            >
              <Asterisk size={12} />
              {busy ? 'Sending…' : 'Submit application'}
            </Pill>

            {touched && Object.keys(errors).length > 0 && (
              <span className="form__errcount label">
                {Object.keys(errors).length} field
                {Object.keys(errors).length === 1 ? '' : 's'} need attention
              </span>
            )}
          </div>

          <p className="form__legal">
            What you write here is read by a person at {CONFIG.NAME} and is not
            published until you have agreed how it reads. Your email is never shown
            publicly.
          </p>
        </form>
      </div>
    </main>
  )
}
