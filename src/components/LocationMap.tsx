import { useState } from 'react'
import { site } from '../config/site'
import { Reveal } from './Reveal'
import { MagneticCta } from './MagneticCta'
import { ClockIcon, PinIcon, OrderBagIcon } from './icons'

/**
 * Location.
 *
 * The map is a keyless `output=embed` iframe (no API key, no billing account).
 * It sits behind a tap-to-interact shield: until you tap, the iframe can't
 * capture your scroll gesture — which is the one thing that makes embedded maps
 * infuriating on a phone. This is also why index.css deliberately omits Lenis'
 * stock `iframe { pointer-events: none }` rule.
 */
export function LocationMap() {
  const [live, setLive] = useState(false)

  return (
    <section
      id="visit"
      className="relative isolate overflow-hidden bg-cream-200/70 py-20 md:py-28 lg:py-32"
    >
      <div
        aria-hidden
        className="waffle-motif mask-fade-b pointer-events-none absolute inset-0 opacity-70"
      />

      <div className="shell relative grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        {/* ---------- Details ---------- */}
        <div className="lg:col-span-5">
          <Reveal x={-20} y={16}>
            <span className="eyebrow text-honey-700">Come by</span>
            <h2 className="display mt-4 text-[clamp(2.125rem,8.6vw,2.75rem)] text-toast-800 md:text-[3.25rem]">
              Find us in{' '}
              <span className="display-accent text-honey-600">the Junction.</span>
            </h2>

            <div className="mt-8 space-y-6">
              {/* Address */}
              <div className="flex gap-4">
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cream-50 text-berry-500 shadow-soft ring-1 ring-toast-200/60">
                  <PinIcon className="h-[1.15rem] w-[1.15rem]" />
                </span>
                <div>
                  <span className="eyebrow text-toast-300">Address</span>
                  <address className="mt-2 text-[1rem] leading-[1.6] text-toast-700 not-italic md:text-[1.0625rem]">
                    {site.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                  <p className="mt-1.5 text-[0.75rem] text-toast-400">
                    Exact street address to be confirmed — the map pins our Junction
                    neighbourhood for now.
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4">
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cream-50 text-honey-600 shadow-soft ring-1 ring-toast-200/60">
                  <ClockIcon className="h-[1.15rem] w-[1.15rem]" />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="eyebrow text-toast-300">Hours (to confirm)</span>
                  <dl className="mt-2 space-y-1.5">
                    {site.hours.map((h) => (
                      <div
                        key={h.days}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-toast-200/60 pb-1.5 last:border-b-0"
                      >
                        <dt className="text-[0.9375rem] text-toast-600">{h.days}</dt>
                        <dd className="text-[0.875rem] font-medium text-toast-700 tabular-nums">
                          {h.time}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>

            {/* At `lg` this row lives in a col-span-5 track that's only ~350px
                wide at 1024px, so the two pills are within a few pixels of
                overflowing it. Hence the short second label — "Get directions"
                pushed the pair over and flex-shrink shaved a pixel off each. */}
            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <MagneticCta
                href={site.links.order}
                variant="primary"
                size="md"
                icon={<OrderBagIcon className="h-[1.15rem] w-[1.15rem]" />}
              >
                Order online
              </MagneticCta>
              <MagneticCta
                href={site.map.directions}
                variant="cream"
                size="md"
                withArrow
                label="Get directions to the shop"
              >
                Directions
              </MagneticCta>
            </div>
          </Reveal>
        </div>

        {/* ---------- Map ---------- */}
        <Reveal className="lg:col-span-7" y={28} delay={0.08}>
          <div className="relative overflow-hidden rounded-[var(--radius-blob)] bg-cream-300 shadow-lift ring-1 ring-toast-200/70">
            <div className="relative aspect-[4/3.4] md:aspect-[16/11] lg:aspect-[16/12]">
              {/* Plate under the iframe.
                  Google's keyless embed is a routine casualty of privacy
                  blockers and flaky networks, and without this the section
                  degrades to a blank cream rectangle. The iframe paints
                  straight over it when it loads, so it costs nothing in the
                  happy path. Deliberately non-interactive and kept out of the
                  centre: the shield's pill lives there, and once the shield
                  lifts the iframe owns every pixel above this — a link here
                  would be unreachable. "Directions" is the live path. */}
              <div aria-hidden className="absolute inset-0 bg-cream-300">
                <div className="waffle-motif absolute inset-0 opacity-70" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-cream-50/80 px-3 py-1.5 ring-1 ring-toast-200/60 backdrop-blur-sm">
                  <PinIcon className="h-3.5 w-3.5 text-berry-500" />
                  <span className="eyebrow text-[0.5625rem] text-toast-500">{site.area}</span>
                </div>
              </div>

              <iframe
                title={`Map — ${site.name}, ${site.area}, ${site.city}`}
                src={site.map.embedSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
                style={{ filter: 'saturate(0.9) contrast(1.02)' }}
              />

              {/* Tap-to-interact shield. Removed on first tap/click. */}
              {!live && (
                <button
                  type="button"
                  onClick={() => setLive(true)}
                  className="group absolute inset-0 grid place-items-center bg-toast-900/12 backdrop-blur-[1px] transition-colors duration-300 hover:bg-toast-900/6"
                  aria-label="Activate the map"
                >
                  <span className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.8125rem] font-semibold text-toast-700 shadow-soft ring-1 ring-toast-200/60 transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] group-hover:scale-[1.04]">
                    <PinIcon className="h-4 w-4 text-berry-500" />
                    Tap to interact
                  </span>
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
