import { useId } from 'react'

type WaffleGlyphProps = {
  /** Drip / syrup colour — usually the flavour's `tone.syrup`. */
  syrup: string
  /** Soft glow behind the waffle — usually the flavour's `tone.tint`. */
  tint: string
  className?: string
  /** `full` adds a strawberry, a butter pat and a third drip. */
  detail?: 'full' | 'simple'
  /** Varies drip lengths so repeated glyphs never look cloned. */
  seed?: number
  title?: string
}

const COLS = 4
const ROWS = 3
const P_X = 42
const P_Y = 58
const P_W = 25
const P_H = 23
const G_X = 5.33
const G_Y = 5.5

/**
 * Procedural SVG waffle — the placeholder art system.
 *
 * Used by: the static hero fallback, every MenuCard without a photo, and every
 * Gallery tile without a photo. One shape language everywhere, zero image
 * requests, and it scales cleanly from a 96px thumbnail to a full-bleed hero.
 *
 * All gradient IDs are namespaced with `useId()` so multiple instances on one
 * page never collide.
 */
export function WaffleGlyph({
  syrup,
  tint,
  className,
  detail = 'simple',
  seed = 0,
  title,
}: WaffleGlyphProps) {
  const uid = useId().replace(/:/g, '')
  const id = (name: string) => `${name}-${uid}`

  // Deterministic per-instance variation.
  const jitter = (n: number) => ((seed * 7 + n * 13) % 5) * 3

  const pockets: Array<{ x: number; y: number }> = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      pockets.push({ x: P_X + c * (P_W + G_X), y: P_Y + r * (P_H + G_Y) })
    }
  }

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <radialGradient id={id('glow')} cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor={tint} stopOpacity="0.95" />
          <stop offset="65%" stopColor={tint} stopOpacity="0.35" />
          <stop offset="100%" stopColor={tint} stopOpacity="0" />
        </radialGradient>

        <radialGradient id={id('shadow')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2E1A11" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#2E1A11" stopOpacity="0" />
        </radialGradient>

        <linearGradient id={id('plate')} x1="18%" y1="0%" x2="82%" y2="100%">
          <stop offset="0%" stopColor="#F9CB7C" />
          <stop offset="52%" stopColor="#E7A648" />
          <stop offset="100%" stopColor="#D18A2F" />
        </linearGradient>

        <linearGradient id={id('pocket')} x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#AC6C24" />
          <stop offset="100%" stopColor="#C8873A" />
        </linearGradient>

        <linearGradient id={id('gloss')} x1="8%" y1="0%" x2="60%" y2="90%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="46%" stopColor="#FFFFFF" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        <clipPath id={id('clip')}>
          <rect x="30" y="46" width="140" height="104" rx="26" />
        </clipPath>
      </defs>

      {/* Flavour glow */}
      <ellipse cx="100" cy="94" rx="96" ry="92" fill={`url(#${id('glow')})`} />

      {/* Ground shadow */}
      <ellipse cx="101" cy="170" rx="60" ry="10" fill={`url(#${id('shadow')})`} />

      {/* Crust — the slab's thickness, peeking out below */}
      <rect x="30" y="57" width="140" height="104" rx="26" fill="#B0691F" />
      <rect x="30" y="57" width="140" height="104" rx="26" fill="#8F5216" opacity="0.35" />

      {/* Top plate */}
      <rect x="30" y="46" width="140" height="104" rx="26" fill={`url(#${id('plate')})`} />

      {/* Recessed pockets */}
      <g fill={`url(#${id('pocket')})`}>
        {pockets.map((p, i) => (
          <rect key={i} x={p.x} y={p.y} width={P_W} height={P_H} rx="7" />
        ))}
      </g>
      {/* Pocket floor highlight — sells the depth */}
      <g fill="#FFFFFF" opacity="0.13">
        {pockets.map((p, i) => (
          <rect key={i} x={p.x + 2.5} y={p.y + P_H - 7} width={P_W - 5} height="4.5" rx="2.2" />
        ))}
      </g>

      {/* Specular gloss across the plate */}
      <rect
        x="30"
        y="46"
        width="140"
        height="104"
        rx="26"
        fill={`url(#${id('gloss')})`}
        style={{ mixBlendMode: 'soft-light' }}
      />

      {/* Syrup pool — clipped so it hugs the plate's rounded corners */}
      <g clipPath={`url(#${id('clip')})`}>
        <path
          d="M28 62 C 44 48 60 58 78 60 C 94 62 108 49 126 53 C 142 57 158 47 172 60 L 172 82 C 154 94 138 83 124 87 C 106 92 92 80 74 85 C 56 90 42 79 28 84 Z"
          fill={syrup}
        />
        {/* Wet highlight along the pool's crest */}
        <path
          d="M40 60 C 54 52 66 59 80 62 C 94 65 108 54 124 58"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.34"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      {/* Drips — deliberately NOT clipped, so the long one hangs over the crust */}
      <g fill={syrup}>
        <rect x="54" y="78" width="9" height={30 + jitter(1)} rx="4.5" />
        <circle cx="58.5" cy={108 + jitter(1)} r="6.2" />

        <rect x="97" y="80" width="10" height={52 + jitter(2)} rx="5" />
        <circle cx="102" cy={132 + jitter(2)} r="7" />

        {detail === 'full' && (
          <>
            <rect x="136" y="78" width="8" height={76 + jitter(3)} rx="4" />
            <circle cx="140" cy={154 + jitter(3)} r="5.6" />
          </>
        )}
      </g>

      {detail === 'full' && (
        <>
          {/* Butter pat, melting slightly off-axis */}
          <g transform="rotate(-7 94 56)">
            <rect x="80" y="46" width="28" height="19" rx="6" fill="#F6CE6A" />
            <rect x="80" y="46" width="28" height="9" rx="5" fill="#FFE6A0" />
          </g>

          {/* Strawberry */}
          <g transform="translate(147 45) scale(1.06)">
            {[-62, -31, 0, 31, 62].map((a) => (
              <ellipse
                key={a}
                cx="0"
                cy="-13.5"
                rx="2.5"
                ry="6.2"
                fill="#3F7A3C"
                transform={`rotate(${a} 0 -8)`}
              />
            ))}
            <path
              d="M0 -10 C 7.5 -12.4 12.6 -6 11.4 2 C 10.3 10.4 4.2 17.4 0 17.4 C -4.2 17.4 -10.3 10.4 -11.4 2 C -12.6 -6 -7.5 -12.4 0 -10 Z"
              fill="#E0344B"
            />
            <path
              d="M-4 -9.2 C -8.6 -7 -11 -2.4 -10.6 2.4 C -10 6 -8.4 9.4 -6.2 12"
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity="0.4"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <g fill="#FFE9A8" opacity="0.9">
              <ellipse cx="-5" cy="0" rx="1" ry="1.5" />
              <ellipse cx="3.4" cy="-3.4" rx="1" ry="1.5" />
              <ellipse cx="5.6" cy="4" rx="1" ry="1.5" />
              <ellipse cx="-1.6" cy="7.4" rx="1" ry="1.5" />
              <ellipse cx="-6.4" cy="-5.6" rx="1" ry="1.5" />
            </g>
          </g>
        </>
      )}
    </svg>
  )
}
