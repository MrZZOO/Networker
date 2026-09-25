import { useEffect, useRef } from 'react'

/* Wrap children so they fade+slide in on scroll.

   SELF-OBSERVING, and that is the whole point. `.reveal` starts at opacity 0 and
   only becomes visible once something adds `is-visible`. useReveal() does that
   with a single page-level sweep — querySelectorAll('.reveal:not(.is-visible)')
   — which runs when the PAGE mounts. Anything that appears later never existed
   for that sweep, so it is never observed, never gets the class, and sits at
   zero opacity forever: present in the DOM, correct, and invisible.

   That is exactly what happened to the fees card on the token page. It mounts
   only after Privy resolves the wallet and the chain reads land, long after the
   sweep, so it rendered perfectly and could not be seen.

   So each wrapper now observes its own node on mount. useReveal() still works
   and can stay — adding `is-visible` twice is harmless — but nothing depends on
   the page sweep having happened after the element existed. */
export default function RevealOnScroll({ children, delay, as: Tag = 'div', className = '', style }) {
  const ref = useRef(null)
  const cls = ['reveal', delay ? `reveal--delay-${delay}` : '', className].filter(Boolean).join(' ')

  useEffect(() => {
    const el = ref.current
    if (!el || el.classList.contains('is-visible')) return

    // Same escape hatches as useReveal: no animation means show it immediately.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) {
      el.classList.add('is-visible')
      return
    }

    // Thresholds mirror useReveal so a self-observed element behaves identically
    // to one caught by the page sweep. An element already on screen fires on the
    // observer's first callback, so nothing waits for a scroll that never comes.
    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return <Tag ref={ref} className={cls} style={style}>{children}</Tag>
}
