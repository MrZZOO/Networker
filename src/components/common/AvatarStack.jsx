import { initials } from '../../lib/format.js'

/* The overlapping avatar stack from the reference hero.

   With real avatars it is a stack of faces. With NONE — which is the day-one truth —
   it renders three overlapping DASHED RINGS, the last carrying a "+".

   That is the whole empty-state thesis in one component: where the reference shows
   faces, Networker shows vacancies. A dashed ring claims nothing. It is visibly an
   absence, and an absence is the truth. The stack never disappears and never
   shrinks, so the pill keeps its exact geometry either way. */
export default function AvatarStack({ avatars = [], size = 28, vacancies = 3 }) {
  const real = Array.isArray(avatars) ? avatars.filter(Boolean) : []

  if (real.length > 0) {
    return (
      <span className="avatars" style={{ '--avatar-size': `${size}px` }}>
        {real.slice(0, 5).map((a, i) => (
          <span className="avatars__item" key={a.id ?? a.handle ?? i}>
            {a.avatarUrl ? (
              <img src={a.avatarUrl} alt={a.displayName ?? ''} />
            ) : (
              <span className="avatars__initials">{initials(a.displayName)}</span>
            )}
          </span>
        ))}
      </span>
    )
  }

  return (
    <span
      className="avatars avatars--vacant"
      style={{ '--avatar-size': `${size}px` }}
      aria-hidden="true"
    >
      {Array.from({ length: vacancies }, (_, i) => (
        <span className="avatars__item avatars__item--vacant" key={i}>
          {i === vacancies - 1 ? '+' : ''}
        </span>
      ))}
    </span>
  )
}
