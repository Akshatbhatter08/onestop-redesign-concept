import type { Transition, Variants } from 'framer-motion'

/**
 * Shared motion language. Everything here animates `transform` / `opacity`
 * only, so reveals stay on the compositor and off the main thread.
 */

export const EASE_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1]
export const EASE_SWIFT: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** Tactile press/hover spring for buttons and cards. */
export const springSoft: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 26,
  mass: 0.6,
}

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 460,
  damping: 32,
  mass: 0.5,
}

/** Viewport config used by every scroll reveal — fires a little early. */
export const viewportOnce = { once: true, amount: 0.25, margin: '0px 0px -12% 0px' } as const

type RevealOpts = { y?: number; x?: number; scale?: number }

/**
 * Directional reveal: slide + fade + a slight scale, never a bare fade.
 */
export function revealVariants({ y = 30, x = 0, scale = 0.97 }: RevealOpts = {}): Variants {
  return {
    hidden: { opacity: 0, y, x, scale },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: { duration: 0.72, ease: EASE_SOFT },
    },
  }
}

/** Parent container that staggers its children in. */
export function staggerContainer(stagger = 0.09, delayChildren = 0.04): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  }
}

/** Child of a `staggerContainer`. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 34, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.66, ease: EASE_SOFT },
  },
}

/** Word-by-word headline entrance. */
export const headlineWord: Variants = {
  hidden: { opacity: 0, y: '46%', rotate: 2 },
  show: {
    opacity: 1,
    y: '0%',
    rotate: 0,
    transition: { duration: 0.9, ease: EASE_SOFT },
  },
}

/** Static variants used when the visitor prefers reduced motion. */
export const staticVariants: Variants = {
  hidden: { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 },
  show: { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0, transition: { duration: 0 } },
}
