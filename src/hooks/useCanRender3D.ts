import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from './useMediaQuery'

type Verdict = {
  /** Capability probe has finished (avoids a flash of the wrong hero). */
  decided: boolean
  /** Safe to mount the WebGL canvas. */
  enabled: boolean
  /** Why we bailed — handy while debugging on a real phone. */
  reason: string
}

function probeWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl')
    if (!gl) return false
    // Release the probe context immediately so we don't burn one of the
    // browser's limited WebGL contexts.
    const lose = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')
    lose?.loseContext()
    return true
  } catch {
    return false
  }
}

/**
 * Decides whether this device should get the 3D hero.
 *
 * Bails out for: reduced-motion, no WebGL, very low core counts, low device
 * memory, and data-saver / reduced-data preferences. Anything that bails gets
 * the static SVG hero instead — which is a designed fallback, not a downgrade.
 */
export function useCanRender3D(): Verdict {
  const reduced = usePrefersReducedMotion()
  const [verdict, setVerdict] = useState<Verdict>({
    decided: false,
    enabled: false,
    reason: 'probing',
  })

  useEffect(() => {
    if (reduced) {
      setVerdict({ decided: true, enabled: false, reason: 'prefers-reduced-motion' })
      return
    }

    const nav = navigator as Navigator & {
      deviceMemory?: number
      connection?: { saveData?: boolean }
    }

    if (nav.connection?.saveData) {
      setVerdict({ decided: true, enabled: false, reason: 'save-data' })
      return
    }
    if (window.matchMedia('(prefers-reduced-data: reduce)').matches) {
      setVerdict({ decided: true, enabled: false, reason: 'prefers-reduced-data' })
      return
    }
    if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency > 0 && nav.hardwareConcurrency < 4) {
      setVerdict({ decided: true, enabled: false, reason: 'low-core-count' })
      return
    }
    if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4) {
      setVerdict({ decided: true, enabled: false, reason: 'low-device-memory' })
      return
    }
    if (!probeWebGL()) {
      setVerdict({ decided: true, enabled: false, reason: 'no-webgl' })
      return
    }

    setVerdict({ decided: true, enabled: true, reason: 'ok' })
  }, [reduced])

  return verdict
}

/**
 * Resolves once the browser is idle, so the 3D chunk never competes with
 * first paint, fonts, or the initial reveal animations.
 */
export function useIdleReady(timeout = 1400): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (handle: number) => void
    }

    if (typeof w.requestIdleCallback === 'function') {
      const handle = w.requestIdleCallback(() => setReady(true), { timeout })
      return () => w.cancelIdleCallback?.(handle)
    }

    const t = window.setTimeout(() => setReady(true), 320)
    return () => window.clearTimeout(t)
  }, [timeout])

  return ready
}
