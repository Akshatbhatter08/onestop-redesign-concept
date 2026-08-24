import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  revealVariants,
  staggerContainer,
  staggerItem,
  staticVariants,
  viewportOnce,
} from '../lib/motion'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Seconds. Use for hand-tuned sequencing outside a Stagger. */
  delay?: number
  /** Travel distance in px. Negative pulls from below. */
  y?: number
  x?: number
  scale?: number
}

/**
 * Single scroll reveal: slide + fade + slight scale, in one direction.
 * Never a bare fade — the directional travel is what makes it feel authored.
 */
export function Reveal({ children, className, delay = 0, y = 30, x = 0, scale = 0.97 }: RevealProps) {
  const reduced = usePrefersReducedMotion()

  return (
    <motion.div
      className={className}
      variants={reduced ? staticVariants : revealVariants({ y, x, scale })}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={reduced ? { duration: 0 } : { delay }}
    >
      {children}
    </motion.div>
  )
}

type StaggerProps = {
  children: ReactNode
  className?: string
  /** Gap between children, in seconds. */
  stagger?: number
  delayChildren?: number
}

/** Container that releases its `StaggerItem` children in sequence. */
export function Stagger({ children, className, stagger = 0.09, delayChildren = 0.04 }: StaggerProps) {
  const reduced = usePrefersReducedMotion()

  return (
    <motion.div
      className={className}
      variants={reduced ? staticVariants : staggerContainer(stagger, delayChildren)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  )
}

/** Child of `Stagger`. Inherits timing from the parent. */
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = usePrefersReducedMotion()

  return (
    <motion.div className={className} variants={reduced ? staticVariants : staggerItem}>
      {children}
    </motion.div>
  )
}
