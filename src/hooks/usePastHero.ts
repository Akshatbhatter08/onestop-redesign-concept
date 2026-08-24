import { useEffect, useState } from 'react'
import { useLenis } from 'lenis/react'

/**
 * True once the visitor has scrolled past most of the hero.
 *
 * Shared by the sticky order bar (show) and the nav Order button (hide) so
 * only one order affordance is on screen at a time. Listens to Lenis *and*
 * native scroll — Lenis can swallow `window.scrollTo`, and Framer's
 * `useScroll` then never fires.
 */
export function usePastHero(): boolean {
  const [past, setPast] = useState(false)

  const apply = (v: number) => {
    // Lenis and window.scrollY can briefly disagree (programmatic scroll,
    // address-bar collapse). Take the larger so we never flap back to "in hero".
    const y = Math.max(v, window.scrollY)
    const trigger = window.innerHeight * 0.72
    setPast((prev) => (prev ? y > trigger * 0.85 : y > trigger))
  }

  useLenis((l) => apply(l.scroll))

  useEffect(() => {
    const onScroll = () => apply(window.scrollY)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return past
}
