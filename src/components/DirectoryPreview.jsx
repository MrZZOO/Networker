import Asterisk from './common/Asterisk.jsx'
import EmptyState from './common/EmptyState.jsx'
import ListingCard from './ListingCard.jsx'
import RevealOnScroll from './common/RevealOnScroll.jsx'

/* The directory slice on the home page.

   `listings` defaults to [] and stays [] in v1: there is no backend and no
   legitimate way to populate it. When real records arrive the same grid renders
   them, so nothing here has to change. */
export default function DirectoryPreview({ listings = [] }) {
  const hasListings = listings.length > 0

  return (
    <section className="section" id="directory">
      <RevealOnScroll>
        <div className="section__head">
          <span className="label">
            <Asterisk size={10} /> The directory
          </span>
          <h2 className="section__title">
            {hasListings ? (
              <>
                Networks <em>open</em> right now
              </>
            ) : (
              <>
                Nobody is listed <em>yet</em>
              </>
            )}
          </h2>
        </div>

        {hasListings ? (
          <div className="listing-grid">
            {listings.map((l) => (
              <ListingCard listing={l} key={l.id} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </RevealOnScroll>
    </section>
  )
}
