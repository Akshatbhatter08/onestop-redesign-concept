import { AnimatePresence, motion } from 'framer-motion'
import { config, copy } from '../config/business'
import { useIsDesktopUp, usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { usePastHero } from '../hooks/usePastHero'
import { EASE_SOFT, springSoft } from '../lib/motion'
import { InstagramIcon, OrderBagIcon } from './icons'

/**
 * Mobile order bar.
 *
 * Appears once you've cleared the hero — before that the hero's own CTA is
 * right there, and doubling up just eats screen. Hidden from `lg` up, where the
 * nav's Order button is always visible instead.
 *
 * Sits above the iOS home indicator via `env(safe-area-inset-bottom)`.
 */
export function StickyOrderBar() {
  const reduced = usePrefersReducedMotion()
  const desktop = useIsDesktopUp()
  const shown = usePastHero() && !desktop

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40"
          data-sticky-order=""
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
          initial={reduced ? { opacity: 0 } : { y: '130%', opacity: 0 }}
          animate={reduced ? { opacity: 1 } : { y: '0%', opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: '130%', opacity: 0 }}
          transition={reduced ? { duration: 0.15 } : { ...springSoft, damping: 30 }}
        >
          {/* Scrim so the bar never floats over busy content unreadably */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-8 bottom-0 bg-gradient-to-t from-cream-100 via-cream-100/85 to-transparent"
          />

          <div className="relative px-4 pt-2">
            <div className="glass flex items-center gap-3 rounded-full p-2 pl-4 shadow-lift ring-1 ring-toast-200/60">
              {/* Brand cue, restated where the thumb is */}
              <span className="flex min-w-0 flex-col leading-none">
                <span className="display text-[1.0625rem] text-toast-800">
                  {config.wordmark.second}
                </span>
                <span className="eyebrow mt-1 text-[0.5rem] text-toast-400">
                  {copy.brandDescriptor}
                </span>
              </span>

              <a
                href={config.links.instagramDm}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DM us on Instagram"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cream-50 text-toast-600 ring-1 ring-toast-200/70 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.92]"
              >
                <InstagramIcon className="h-[1.15rem] w-[1.15rem]" />
              </a>

              <motion.a
                href={config.links.order}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-berry-500 text-[0.9375rem] font-semibold text-cream-50 shadow-cta"
                whileTap={reduced ? undefined : { scale: 0.96 }}
                transition={{ duration: 0.18, ease: EASE_SOFT }}
              >
                <OrderBagIcon className="h-[1.15rem] w-[1.15rem]" />
                {copy.cta.orderSentence}
              </motion.a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
