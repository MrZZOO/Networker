import NetworkPlate from './NetworkPlate.jsx'

/* A small rounded image card.

   `src` null → NetworkPlate at the SAME aspect ratio and radius, so the day real
   images land in public/ and the CONFIG slots fill, nothing in the layout moves.
   Real photos carry the saturation filter and the wash veil that reproduce the
   reference's duotone treatment. */
export default function PhotoCard({
  src = null,
  alt = '',
  seed = 1,
  variant = 'card',
  ratio = '4 / 3',
  radius = 'var(--radius-photo)',
  className = '',
  children,
}) {
  return (
    <div
      className={`photo-card ${className}`}
      style={{ aspectRatio: ratio, borderRadius: radius }}
    >
      {src ? (
        <>
          <img className="photo-card__img" src={src} alt={alt} loading="lazy" />
          <span className="photo-card__veil" aria-hidden="true" />
        </>
      ) : (
        <NetworkPlate seed={seed} variant={variant} />
      )}
      {children}
    </div>
  )
}
