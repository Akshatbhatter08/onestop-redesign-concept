import { WaffleGlyph } from './WaffleGlyph'
import { cx } from '../lib/cx'

type Props = {
  /**
   * `true` while the WebGL chunk is still downloading — the art sits back a
   * little so the hand-off to 3D doesn't feel like a swap.
   */
  loading?: boolean
  className?: string
}

/**
 * The static hero.
 *
 * Two jobs: the poster shown while the 3D chunk downloads, and the permanent
 * hero on reduced-motion / low-end / no-WebGL devices. Deliberately designed
 * rather than a grey box — a visitor who never gets WebGL should not be able to
 * tell they're missing anything.
 */
export function HeroWaffleFallback({ loading = false, className }: Props) {
  return (
    <div
      className={cx(
        'pointer-events-none absolute inset-0 flex items-center justify-center lg:translate-x-[6%]',
        'transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
        loading ? 'opacity-70' : 'opacity-100',
        className,
      )}
      aria-hidden
    >
      {/* Warm bloom behind the waffle — the light source the art implies */}
      <div className="absolute h-[78%] w-[92%] max-w-[620px] rounded-full bg-honey-300/35 blur-[70px] md:h-[70%]" />
      <div className="absolute h-[46%] w-[58%] max-w-[380px] translate-y-6 rounded-full bg-berry-300/20 blur-[60px]" />

      <WaffleGlyph
        syrup="#6B3410"
        tint="#F7C86A"
        detail="full"
        seed={3}
        className={cx(
          'relative w-[92%] max-w-[520px] drop-shadow-[0_28px_46px_rgba(74,40,18,0.28)]',
          'md:w-[82%] md:max-w-[560px] lg:max-w-[640px]',
          !loading && 'animate-float-slow',
        )}
      />
    </div>
  )
}
