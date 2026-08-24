import { Suspense, lazy, useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { config, copy } from '../config/business'
import { useCanRender3D } from '../hooks/useCanRender3D'
import { usePrefersReducedMotion, useHeroFrame } from '../hooks/useMediaQuery'
import {
  EASE_SOFT,
  headlineWord,
  staggerContainer,
  staggerItem,
  staticVariants,
} from '../lib/motion'
import { cx } from '../lib/cx'
import { HeroWaffleFallback } from './HeroWaffleFallback'
import { MagneticCta } from './MagneticCta'
import { OrderBagIcon, PinIcon, SparkIcon } from './icons'

/**
 * Lazy: this is the ONLY import path to three.js / R3F / drei in the app, so
 * Rollup keeps the entire 3D stack in its own chunk and first paint never waits
 * on it. Nothing in the eager graph may import from `src/three/`.
 *
 * The import is kicked off as soon as this module evaluates (not after an idle
 * timeout) so Vercel visitors overlap the ~1MB chunk with first paint instead
 * of waiting 1.4s *then* starting the download.
 */
const waffleScenePromise = import('../three/WaffleScene')
const WaffleScene = lazy(() => waffleScenePromise)

/** Render `**bold**` segments of a copy string as the emphasised inline style. */
function renderEmphasis(text: string) {
  return text.split('**').map((seg, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-toast-700">
        {seg}
      </strong>
    ) : (
      seg
    ),
  )
}

export function Hero() {
  const section = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const { decided, enabled } = useCanRender3D()
  // Single source of truth for band vs side — `window.innerWidth >= 1024`.
  // Do not key this off Tailwind `lg:` or the canvas can frame one layout while
  // the DOM is still in the other.
  const frame = useHeroFrame()
  const desktop = frame === 'side'

  // True while any sliver of the hero is on screen — drives the 3D frameloop,
  // so the GPU goes fully idle once you're reading the menu.
  const active = useInView(section, { amount: 'some' })

  // 0 → 1 across the hero's exit. Feeds the DOM parallax and the 3D rig alike.
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start start', 'end start'],
  })

  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-34%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.14], [1, 0])

  const show3D = decided && enabled
  // Reduced motion: skip variants entirely so nothing ever moves.
  const variants = reduced ? staticVariants : undefined

  return (
    <section
      id="home"
      ref={section}
      data-hero-layout={frame}
      className={cx(
        'relative isolate overflow-hidden',
        desktop
          ? 'grid min-h-[100svh] grid-cols-[minmax(18rem,40%)_minmax(0,1fr)]'
          : 'min-h-[100svh] pt-24 pb-8 md:pt-24',
      )}
    >
      {/* ---------- Backdrop ---------- */}
      {/* Waffle grid, radially masked so it never reads as graph paper. */}
      <div
        aria-hidden
        className="waffle-motif mask-radial pointer-events-none absolute inset-0 z-0"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 z-0 h-[520px] w-[640px] -translate-x-1/2 rounded-full bg-honey-200/55 blur-[90px] md:h-[720px] md:w-[980px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-32 bg-gradient-to-b from-transparent to-cream-100"
      />

      {/* ---------- Copy ---------- */}
      <motion.div
        className={cx(
          'pointer-events-none relative z-20',
          desktop
            ? 'flex items-center pt-24 pb-16 pl-8 pr-4 xl:pl-14 xl:pr-6'
            : 'shell',
        )}
        style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
      >
        <motion.div
          className={cx(
            'pointer-events-auto',
            desktop ? 'w-full max-w-[44rem]' : 'max-w-[34rem]',
          )}
          variants={variants ?? staggerContainer(0.085, 0.12)}
          initial="hidden"
          animate="show"
        >
          {/* Locality pill */}
          <motion.div variants={variants ?? staggerItem}>
            <span className="inline-flex items-center gap-2 rounded-full bg-cream-50/85 py-2 pr-4 pl-2.5 text-[0.75rem] font-semibold text-toast-500 ring-1 ring-toast-200/70 backdrop-blur-sm">
              <PinIcon className="h-3.5 w-3.5 text-berry-500" />
              {config.location.neighbourhood} · {config.location.city}
            </span>
          </motion.div>

          {/* Headline — each line clips its own words so they rise into place */}
          <h1 className="display mt-4 text-[clamp(2.5rem,11.8vw,3.25rem)] !leading-[1.06] text-toast-800 md:mt-5 md:text-[3.5rem] lg:mt-6 lg:text-[clamp(2.6rem,3.7vw,3.75rem)] lg:!leading-[1.1]">
            {copy.hero.headlineLines.map((line, li) => (
              <span
                key={li}
                className={cx(
                  'block overflow-hidden pb-[0.12em] lg:pb-[0.16em]',
                  desktop && line.length > 1 && 'whitespace-nowrap',
                )}
              >
                {line.map((word, wi) => {
                  const accent = copy.hero.accentWords[word]
                  return (
                    <motion.span
                      key={`${word}-${wi}`}
                      variants={variants ?? headlineWord}
                      className={cx(
                        'mr-[0.2em] inline-block last:mr-0',
                        accent && `display-accent ${accent}`,
                      )}
                    >
                      {word}
                    </motion.span>
                  )
                })}
              </span>
            ))}
          </h1>

          <motion.p
            variants={variants ?? staggerItem}
            className="mt-3 max-w-[24rem] text-[1.0625rem] leading-[1.6] text-toast-500 md:mt-5 md:max-w-[32rem] md:text-[1.125rem] md:leading-[1.65]"
          >
            {renderEmphasis(copy.hero.subcopy)}
          </motion.p>

          {/* One row, even at 390px — two stacked pills ate 124px of vertical
              space the 3D stage needs. Below `sm` the secondary collapses to its
              icon and keeps its label on `aria-label`. */}
          <motion.div
            variants={variants ?? staggerItem}
            className="mt-5 flex items-center gap-2.5 sm:gap-3 md:mt-6 lg:mt-8"
          >
            <MagneticCta
              href={config.links.order}
              variant="primary"
              icon={<OrderBagIcon className="h-[1.15rem] w-[1.15rem] shrink-0" />}
              withArrow
              className="min-w-0 flex-1 sm:flex-none"
            >
              {copy.cta.orderLong}
            </MagneticCta>
            <MagneticCta
              href={config.links.catering}
              variant="cream"
              icon={<SparkIcon className="h-[1.05rem] w-[1.05rem] shrink-0" />}
              withArrow
              className="min-w-0 flex-1 sm:flex-none"
            >
              {copy.cta.catering}
            </MagneticCta>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ---------- 3D stage ----------
          Band: overlapping the copy from ~the CTA row down past the fold, so
          the waffle is part of the same block rather than a separate strip.
          Side: the remaining grid track, floor to ceiling. */}
      <div
        aria-hidden
        className={cx(
          'z-10',
            desktop
            ? 'relative h-full min-h-[100svh] min-w-0 self-stretch'
            : 'absolute inset-x-0 bottom-0 h-[46svh] md:h-[50svh]',
          show3D ? 'touch-pan-y' : 'pointer-events-none',
        )}
      >
        {show3D ? (
          <Suspense fallback={<HeroWaffleFallback loading />}>
            <WaffleScene
              scroll={scrollYProgress}
              active={active}
              layout={frame === 'side' ? 'side' : frame}
            />
          </Suspense>
        ) : (
          /* Undecided → hold the poster back so we never flash the wrong hero.
             Decided + disabled → the poster *is* the hero. */
          <HeroWaffleFallback loading={!decided} />
        )}
      </div>

      {/* ---------- Scroll cue ---------- */}
      {desktop && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
          style={reduced ? undefined : { opacity: cueOpacity }}
          initial={reduced ? undefined : { opacity: 0, y: -8 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8, ease: EASE_SOFT }}
        >
          <span className="eyebrow text-[0.625rem] text-toast-400">Scroll</span>
          <span className="animate-bob h-9 w-px bg-gradient-to-b from-toast-300 to-transparent" />
        </motion.div>
      )}
    </section>
  )
}
