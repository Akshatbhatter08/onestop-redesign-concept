import { motion, useTransform } from 'framer-motion'
import { formatPrice, config, copy, type MenuItem } from '../config/business'
import { useTilt } from '../hooks/useInteractions'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { springSoft } from '../lib/motion'
import { cx } from '../lib/cx'
import { WaffleGlyph } from './WaffleGlyph'
import { ArrowIcon } from './icons'

type Props = {
  item: MenuItem
  /** Varies the placeholder art so no two cards look cloned. */
  index: number
  className?: string
}

/**
 * A menu card.
 *
 * Desktop: tilts toward the cursor, and the waffle inside counter-parallaxes so
 * the card reads as having depth rather than being a rotating rectangle.
 * Touch: no tilt — a crisp press-scale, which is what a thumb expects.
 *
 * Tapping the card opens their online ordering.
 */
export function MenuCard({ item, index, className }: Props) {
  const reduced = usePrefersReducedMotion()
  const { ref, active, rotateX, rotateY, pointerX, pointerY, handlers } =
    useTilt<HTMLAnchorElement>(6)

  // Counter-parallax: art drifts against the tilt, badge/price with it.
  const artX = useTransform(pointerX, (v) => v * -26)
  const artY = useTransform(pointerY, (v) => v * -18)

  const isFeatured = item.featured === true

  return (
    <motion.a
      ref={ref}
      href={config.links.order}
      className={cx(
        'group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-cream-50 shadow-soft ring-1 ring-toast-200/60 will-change-transform',
        'transition-shadow duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-lift',
        className,
      )}
      style={
        active
          ? { rotateX, rotateY, transformPerspective: 1000, transformStyle: 'preserve-3d' }
          : undefined
      }
      whileTap={reduced ? undefined : { scale: 0.975 }}
      whileHover={reduced || active ? undefined : { y: -4 }}
      transition={springSoft}
      {...handlers}
    >
      {/* ---------- Media ---------- */}
      <div
        className="relative aspect-[4/3.1] overflow-hidden"
        style={{ backgroundColor: item.tone.tint }}
      >
        {/* Flavour wash */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{
            background: `radial-gradient(circle at 50% 34%, rgb(255 255 255 / 0.65), transparent 62%)`,
          }}
        />

        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
          />
        ) : (
          /* PLACEHOLDER ART — swap `image` in src/data/menu.ts for a real photo */
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={active ? { x: artX, y: artY } : undefined}
          >
            <WaffleGlyph
              syrup={item.tone.syrup}
              tint={item.tone.tint}
              detail={isFeatured ? 'full' : 'simple'}
              seed={index + 1}
              className="w-[76%] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            />
          </motion.div>
        )}

        {item.badge && (
          <span
            className={cx(
              'absolute top-3.5 left-3.5 rounded-full px-3 py-1.5 text-[0.625rem] font-bold tracking-[0.12em] uppercase shadow-soft backdrop-blur-sm',
              isFeatured
                ? 'bg-toast-800/92 text-honey-300'
                : 'bg-cream-50/92 text-toast-600',
            )}
          >
            {item.badge}
          </span>
        )}
      </div>

      {/* ---------- Copy ---------- */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="display text-[1.1875rem] leading-[1.15] text-toast-800 md:text-[1.3125rem]">
            {item.name}
          </h3>
          <span className="notch shrink-0 rounded-full bg-honey-100 px-3 py-1.5 ring-1 ring-honey-300/70">
            <span className="price text-[0.9375rem] whitespace-nowrap text-toast-800 tabular-nums md:text-[1.0625rem]">
              {formatPrice(item.price, item.priceMax)}
            </span>
          </span>
        </div>

        {item.blurb ? (
          <p className="mt-2.5 line-clamp-3 flex-1 text-[0.875rem] leading-[1.65] text-toast-500">
            {item.blurb}
          </p>
        ) : (
          <div className="flex-1" />
        )}

        <span className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-berry-500">
          {copy.cta.orderThis}
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
        </span>
      </div>
    </motion.a>
  )
}
