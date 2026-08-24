import { useEffect, useState } from 'react'

/**
 * SSR-safe `matchMedia` subscription.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** True when the visitor has asked the OS to reduce motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/**
 * True for genuine mouse/trackpad pointers only.
 * Gates hover-dependent flourishes (magnetic buttons, card tilt) so touch
 * devices get clean tap states instead of sticky :hover artefacts.
 */
export function useHasFinePointer(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}

/** `md` and up — matches Tailwind's 768px breakpoint. */
export function useIsTabletUp(): boolean {
  return useMediaQuery('(min-width: 768px)')
}

/**
 * `lg` and up: copy-beside-canvas hero, nav links, no sticky order bar.
 *
 * Uses `window.innerWidth >= 1024` (not `matchMedia`) so a viewport *set* to
 * 1024px — iPad landscape, DevTools, Playwright — always lands on the side
 * layout. CSS `min-width` can read a few pixels smaller when a classic
 * scrollbar is present, which is what left 1024px stuck on the band.
 */
export function useIsDesktopUp(): boolean {
  return useMinInnerWidth(1024)
}

/**
 * How the hero should frame the waffle. Derived from the window, not the
 * canvas aspect — a 768×1024 tablet still has a *wide* canvas strip, which
 * used to get misread as landscape and shove the waffle off to the side.
 */
export function useHeroFrame(): 'phone' | 'tablet' | 'wide' | 'side' {
  const desktop = useIsDesktopUp()
  const tablet = useIsTabletUp()
  const short = useMediaQuery('(max-height: 860px)')
  if (desktop) return 'side'
  if (tablet && short) return 'wide'
  if (tablet) return 'tablet'
  return 'phone'
}

function useMinInnerWidth(px: number): boolean {
  const [ok, setOk] = useState(() =>
    typeof window === 'undefined' ? false : window.innerWidth >= px,
  )

  useEffect(() => {
    const update = () => setOk(window.innerWidth >= px)
    update()
    window.addEventListener('resize', update)
    window.visualViewport?.addEventListener('resize', update)
    return () => {
      window.removeEventListener('resize', update)
      window.visualViewport?.removeEventListener('resize', update)
    }
  }, [px])

  return ok
}
