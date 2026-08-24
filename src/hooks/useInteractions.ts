import { useCallback, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useHasFinePointer, usePrefersReducedMotion } from './useMediaQuery'

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

/**
 * Magnetic hover for desktop CTAs — the button leans toward the cursor and
 * springs back on exit. The label trails at a fraction of the travel, which is
 * what sells the effect as "weighty" rather than "sliding".
 *
 * Disabled entirely on touch/coarse pointers and under reduced-motion, so
 * mobile gets clean tap states instead.
 *
 * The element rect is measured once on pointer-enter and reused for the whole
 * gesture — measuring per-move would force a layout on every frame.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.3, max = 13) {
  const ref = useRef<T | null>(null)
  const rect = useRef<DOMRect | null>(null)

  const fine = useHasFinePointer()
  const reduced = usePrefersReducedMotion()
  const active = fine && !reduced

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const config = { stiffness: 240, damping: 19, mass: 0.42 }
  const sx = useSpring(x, config)
  const sy = useSpring(y, config)

  // Label trails the container — parallax within the button itself.
  const labelX = useTransform(sx, (v) => v * 0.34)
  const labelY = useTransform(sy, (v) => v * 0.34)

  const onPointerEnter = useCallback(
    (e: ReactPointerEvent<T>) => {
      if (!active || e.pointerType !== 'mouse') return
      rect.current = ref.current?.getBoundingClientRect() ?? null
    },
    [active],
  )

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<T>) => {
      if (!active || e.pointerType !== 'mouse') return
      const r = rect.current ?? ref.current?.getBoundingClientRect()
      if (!r) return
      rect.current = r
      x.set(clamp((e.clientX - (r.left + r.width / 2)) * strength, -max, max))
      y.set(clamp((e.clientY - (r.top + r.height / 2)) * strength, -max, max))
    },
    [active, strength, max, x, y],
  )

  const reset = useCallback(() => {
    rect.current = null
    x.set(0)
    y.set(0)
  }, [x, y])

  return {
    ref,
    active,
    x: sx,
    y: sy,
    labelX,
    labelY,
    handlers: {
      onPointerEnter,
      onPointerMove,
      onPointerLeave: reset,
      onPointerCancel: reset,
    },
  }
}

/**
 * Subtle 3D card tilt that tracks the cursor. Desktop-only by design — on
 * touch the card gets a press-scale instead (see MenuCard).
 */
export function useTilt<T extends HTMLElement>(maxDeg = 7) {
  const ref = useRef<T | null>(null)
  const rect = useRef<DOMRect | null>(null)

  const fine = useHasFinePointer()
  const reduced = usePrefersReducedMotion()
  const active = fine && !reduced

  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  // Normalised cursor position (-0.5…0.5) so children can parallax too.
  const px = useMotionValue(0)
  const py = useMotionValue(0)

  const config = { stiffness: 220, damping: 22, mass: 0.5 }
  const rotateX = useSpring(rx, config)
  const rotateY = useSpring(ry, config)
  const pointerX = useSpring(px, config)
  const pointerY = useSpring(py, config)

  const onPointerEnter = useCallback(
    (e: ReactPointerEvent<T>) => {
      if (!active || e.pointerType !== 'mouse') return
      rect.current = ref.current?.getBoundingClientRect() ?? null
    },
    [active],
  )

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<T>) => {
      if (!active || e.pointerType !== 'mouse') return
      const r = rect.current ?? ref.current?.getBoundingClientRect()
      if (!r || r.width === 0 || r.height === 0) return
      rect.current = r

      const nx = (e.clientX - r.left) / r.width - 0.5
      const ny = (e.clientY - r.top) / r.height - 0.5

      px.set(nx)
      py.set(ny)
      // Invert Y so the card tips *away* from the cursor — reads as physical.
      rx.set(-ny * maxDeg * 2)
      ry.set(nx * maxDeg * 2)
    },
    [active, maxDeg, px, py, rx, ry],
  )

  const reset = useCallback(() => {
    rect.current = null
    rx.set(0)
    ry.set(0)
    px.set(0)
    py.set(0)
  }, [px, py, rx, ry])

  return {
    ref,
    active,
    rotateX,
    rotateY,
    pointerX,
    pointerY,
    handlers: {
      onPointerEnter,
      onPointerMove,
      onPointerLeave: reset,
      onPointerCancel: reset,
    },
  }
}
