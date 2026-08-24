import { copy } from '../config/business'
import { WaffleMarkIcon } from './icons'

/**
 * Infinite ticker under the hero.
 *
 * The track holds the list twice and translates -50%, so the loop point is
 * seamless. One `transform` animation on one element — nothing else moves.
 */
export function Marquee() {
  return (
    <div
      aria-hidden
      className="waffle-motif-dark relative isolate overflow-hidden border-y border-toast-700/60 bg-toast-800 py-3.5 md:py-4"
    >
      {/* Feather the ends so items don't pop in at the edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-toast-800 to-transparent md:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-toast-800 to-transparent md:w-24" />

      <div className="animate-marquee flex w-max will-change-transform">
        {[0, 1].map((copyIdx) => (
          <div key={copyIdx} className="flex shrink-0 items-center">
            {copy.marquee.map((item) => (
              <span key={item} className="flex shrink-0 items-center">
                <span className="px-5 text-[0.8125rem] font-medium tracking-[0.02em] whitespace-nowrap text-cream-200/85 md:px-7 md:text-[0.9375rem]">
                  {item}
                </span>
                <WaffleMarkIcon className="h-2.5 w-2.5 shrink-0 text-honey-400/70" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
