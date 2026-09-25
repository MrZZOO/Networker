import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/* On route change: jump to top; if the URL carries a hash (e.g. /#hooks from the
   launch page), scroll to that section instead. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}
