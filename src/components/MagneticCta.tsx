import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useMagnetic } from '../hooks/useInteractions'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { springSoft } from '../lib/motion'
import { cx } from '../lib/cx'
import { ArrowIcon } from './icons'

type Variant = 'primary' | 'dark' | 'cream' | 'outline'
type Size = 'sm' | 'md' | 'lg'

type Props = {
  href: string
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
  icon?: ReactNode
  withArrow?: boolean
  /** Accessible label when the visible text isn't descriptive enough. */
  label?: string
}

/**
 * `whitespace-nowrap` is load-bearing, not cosmetic. Every size below sets a
 * *fixed* height, so a label that wraps doesn't grow the pill — it eats the
 * vertical padding and prints two cramped lines inside a one-line button. And
 * these sit in flex rows (`Visit`, the hero), where `flex-shrink` will happily
 * squeeze a pill a few pixels under its text width to make a row fit. Nowrap
 * pins min-content to max-content so it can't.
 */
const BASE =
  'group relative inline-flex select-none items-center justify-center overflow-visible rounded-full font-semibold tracking-[-0.01em] whitespace-nowrap will-change-transform'

const SIZES: Record<Size, string> = {
  sm: 'h-11 px-5 text-[0.875rem]',
  md: 'h-13 px-6 text-[0.9375rem]',
  lg: 'h-14 px-4 text-[0.8125rem] sm:px-7 sm:text-[0.9375rem] md:h-15 md:px-8 md:text-base',
}

/**
 * Each variant owns its own colours completely.
 *
 * Don't recolour one from the call site: `cx` is a plain join, not
 * tailwind-merge, so a `text-*` in `className` doesn't override the variant's
 * `text-*` — both land on the element and CSS source order picks the winner.
 * That's how the footer's secondary CTA ended up printing toast-700 on a
 * toast-800 background. Need a new colour treatment? Add a variant here.
 */
const VARIANTS: Record<Variant, string> = {
  primary: 'bg-berry-500 text-cream-50 shadow-cta',
  dark: 'bg-toast-800 text-cream-100 shadow-lift',
  cream: 'bg-cream-50 text-toast-700 ring-1 ring-toast-300/60 shadow-soft',
  /** For dark surfaces only — inverts to a cream fill on hover. */
  outline: 'bg-transparent text-cream-200 ring-1 ring-cream-200/25 hover:text-toast-800',
}

/**
 * The one CTA component.
 *
 * Desktop: leans toward the cursor (magnetic), label trails at ~⅓ travel.
 * Touch: magnetism is off; you get a crisp press-scale instead.
 * Reduced motion: no scale, no lean — just the colour state change.
 */
export function MagneticCta({
  href,
  children,
  variant = 'primary',
  size = 'lg',
  className,
  icon,
  withArrow = false,
  label,
}: Props) {
  const reduced = usePrefersReducedMotion()
  const { ref, x, y, labelX, labelY, handlers } = useMagnetic<HTMLAnchorElement>()
  const external = href.startsWith('http')

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={label}
      className={cx(BASE, SIZES[size], VARIANTS[variant], className)}
      style={{ x, y }}
      whileHover={reduced ? undefined : { scale: 1.035 }}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      transition={springSoft}
      {...handlers}
    >
      {/* Clip the sheen to the pill without clipping the label — overflow-hidden
          on the button itself was eating the bag/arrow when flex squeezed it. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        <span className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span
          className={cx(
            'absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
            variant === 'primary' && 'bg-berry-600',
            variant === 'dark' && 'bg-toast-900',
            variant === 'cream' && 'bg-white',
            variant === 'outline' && 'bg-cream-100',
          )}
        />
      </span>

      <motion.span
        style={reduced ? undefined : { x: labelX, y: labelY }}
        className="relative z-10 flex min-w-0 items-center justify-center gap-1.5 sm:gap-2.5"
      >
        {icon}
        <span className="shrink-0">{children}</span>
        {withArrow && (
          <ArrowIcon className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 sm:h-4 sm:w-4" />
        )}
      </motion.span>
    </motion.a>
  )
}
