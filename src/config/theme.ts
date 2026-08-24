/**
 * ============================================================================
 * THEME — derive a CTA accent ramp from one brand hex.
 * ============================================================================
 *
 * `berry` is the design system's only punchy accent — CTAs, the focus ring, the
 * "order this" arrow. A business can rebrand that accent with a single hex
 * (`theme.accent`); we mirror berry's own lightness structure onto the new hue
 * so the ramp keeps the same pop at every stop.
 *
 * If `theme.accent` is omitted, `accentStyleCss` returns '' and NOTHING is
 * injected — the shipped `--color-berry-*` tokens stand untouched, so the
 * default brand renders byte-for-byte identically. This is what lets the One
 * Stop refactor stay visually invisible.
 *
 * React-free — imported by `vite.config.ts` to inject the accent at build time.
 */

type Rgb = { r: number; g: number; b: number }

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

function hexToRgb(hex: string): Rgb | null {
  const raw = hex.trim().replace(/^#/, '')
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

function rgbToHsl({ r, g, b }: Rgb) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  let h = 0
  let s = 0
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h /= 6
  }
  return { h, s, l }
}

function hue2rgb(p: number, q: number, t: number) {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

function hslToHex(h: number, s: number, l: number): string {
  let r: number
  let g: number
  let b: number
  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  const to = (x: number) =>
    Math.round(clamp01(x) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

/**
 * Lightness targets pulled from the shipped `berry` ramp (index.css). We keep
 * the accent's own hue + saturation and remap lightness across these five
 * stops, so any hue lands as a coherent 300→700 scale.
 */
const STOPS: { k: number; l: number }[] = [
  { k: 300, l: 0.739 },
  { k: 400, l: 0.635 },
  { k: 500, l: 0.541 },
  { k: 600, l: 0.445 },
  { k: 700, l: 0.349 },
]

/** Map of berry stop → derived hex, or `null` if the hex is unparseable. */
export function deriveAccentRamp(accent: string): Record<number, string> | null {
  const rgb = hexToRgb(accent)
  if (!rgb) return null
  const { h, s } = rgbToHsl(rgb)
  const ramp: Record<number, string> = {}
  for (const { k, l } of STOPS) ramp[k] = hslToHex(h, s, l)
  return ramp
}

/**
 * A `<style>` body that overrides the berry tokens (and `--shadow-cta`, which
 * bakes berry as raw rgb). Uses `:root:root` — unlayered and double-specificity
 * — so it wins over Tailwind's layered `@theme` tokens regardless of load order.
 * Returns '' for a missing/invalid accent so callers can inject nothing.
 */
export function accentStyleCss(accent?: string): string {
  if (!accent) return ''
  const ramp = deriveAccentRamp(accent)
  if (!ramp) return ''
  const vars = STOPS.map(({ k }) => `--color-berry-${k}:${ramp[k]};`).join('')
  const c6 = hexToRgb(ramp[600])!
  const c5 = hexToRgb(ramp[500])!
  const shadow =
    `--shadow-cta:0 2px 6px rgb(${c6.r} ${c6.g} ${c6.b} / 0.22),` +
    `0 12px 28px -10px rgb(${c5.r} ${c5.g} ${c5.b} / 0.5);`
  return `:root:root{${vars}${shadow}}`
}
