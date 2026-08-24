import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { site } from '../config/site'
import { useIsDesktopUp, usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { usePastHero } from '../hooks/usePastHero'
import { EASE_SOFT } from '../lib/motion'
import { cx } from '../lib/cx'
import { WaffleMarkIcon, OrderBagIcon } from './icons'

const LINKS = [
  { href: '#why', label: 'Why us' },
  { href: '#menu', label: 'Menu' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#visit', label: 'Visit' },
]

/**
 * Floating nav. Starts transparent and open over the hero, then condenses into
 * a frosted pill once you leave it — one element, two states, no layout shift
 * (only padding and background change, both cheap).
 */
export function Nav() {
  const reduced = usePrefersReducedMotion()
  const desktop = useIsDesktopUp()
  const pastHero = usePastHero()
  const { scrollY } = useScroll()
  const [condensed, setCondensed] = useState(false)
  // Sticky bar is `lg:hidden`; only fade the nav Order where that bar exists.
  const hideOrder = pastHero && !desktop

  useMotionValueEvent(scrollY, 'change', (v) => {
    // Hysteresis: no flicker when a trackpad hovers the threshold.
    setCondensed((prev) => (prev ? v > 32 : v > 72))
  })

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="shell">
        <motion.nav
          className={cx(
            'pointer-events-auto mt-3 flex items-center justify-between rounded-full transition-[background-color,box-shadow,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:mt-4',
            condensed
              ? 'glass py-2 pr-2 pl-4 shadow-soft ring-1 ring-toast-200/50 md:pl-5'
              : 'bg-transparent py-3 pr-0 pl-0',
          )}
          initial={reduced ? undefined : { y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE_SOFT, delay: 0.1 }}
        >
          {/* Wordmark */}
          <a
            href="#home"
            className="group flex items-center gap-2.5"
            aria-label={`${site.name} — home`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-toast-800 text-honey-400 shadow-soft transition-transform duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] group-hover:-rotate-6 md:h-10 md:w-10">
              <WaffleMarkIcon className="h-[1.05rem] w-[1.05rem]" />
            </span>
            <span className="flex flex-col gap-1 leading-none">
              <span className="block text-[0.625rem] font-semibold tracking-[0.18em] text-toast-400 uppercase">
                {site.wordmark.first}
              </span>
              <span className="display block text-[1.0625rem] leading-none text-toast-800">
                {site.wordmark.second}
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <div className={cx(desktop ? 'flex items-center gap-1' : 'hidden')}>
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative rounded-full px-3.5 py-2 text-[0.875rem] font-medium text-toast-500 transition-colors duration-200 hover:text-toast-800"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Compact order button — fades once the sticky bar takes over, but
              keeps its slot so the wordmark doesn't jump. CSS, not motion
              values: the parent nav already animates opacity on mount. */}
          <a
            href={site.links.order}
            target="_blank"
            rel="noopener noreferrer"
            data-nav-order=""
            tabIndex={hideOrder ? -1 : undefined}
            aria-hidden={hideOrder}
            className={cx(
              'group flex h-10 items-center gap-2 rounded-full bg-berry-500 px-4 text-[0.8125rem] font-semibold text-cream-50 shadow-cta transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] active:scale-95 md:h-11 md:px-5 md:text-[0.875rem]',
              hideOrder && 'pointer-events-none',
            )}
            style={{
              opacity: hideOrder ? 0 : 1,
              transform: hideOrder ? 'translateY(-6px)' : 'translateY(0)',
            }}
          >
            <OrderBagIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Order Online</span>
            <span className="sm:hidden">Order</span>
          </a>
        </motion.nav>
      </div>
    </header>
  )
}
