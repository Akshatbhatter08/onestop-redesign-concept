import type { ReactNode } from 'react'
import { ReactLenis } from 'lenis/react'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'

/**
 * Lenis smooth scroll.
 *
 * `syncTouch` is intentionally off: native touch scrolling on mobile is already
 * buttery and hardware-accelerated, and hijacking it costs frames on mid-range
 * Androids. Lenis handles wheel/trackpad, the OS handles fingers.
 *
 * Lenis drives the real window scroll position, so Framer Motion's `useScroll`
 * stays in sync with no extra wiring.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()

  // Reduced motion → hand scrolling straight back to the browser.
  if (reduced) return <>{children}</>

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.085,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
        smoothWheel: true,
        syncTouch: false,
        // Smoothly resolve in-page #anchor clicks (nav links).
        anchors: { offset: -80 },
      }}
    >
      {children}
    </ReactLenis>
  )
}
