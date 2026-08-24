import { config, copy } from '../config/business'
import { MODEL_ATTRIBUTION } from '../config/defaults'
import { Reveal } from './Reveal'
import { MagneticCta } from './MagneticCta'
import { InstagramIcon, PinIcon, SparkIcon, WaffleMarkIcon, OrderBagIcon } from './icons'
import { cx } from '../lib/cx'

const YEAR = 2026

export function Footer() {
  return (
    <footer className="waffle-motif-dark relative isolate overflow-hidden bg-toast-800 text-cream-200">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-honey-500/12 blur-[100px]"
      />

      {/* ---------- Final CTA ---------- */}
      <div className="shell relative pt-20 pb-16 text-center md:pt-28 md:pb-20">
        <Reveal y={26}>
          <span className="eyebrow text-honey-400/80">{copy.footer.finalEyebrow}</span>
          <h2 className="display mx-auto mt-5 max-w-[22ch] text-[clamp(2.25rem,9.6vw,3rem)] text-cream-100 md:text-[3.75rem] lg:text-[4.25rem]">
            {copy.footer.finalHeadline.lead}{' '}
            <span className={cx('display-accent', copy.footer.finalHeadline.accentClass)}>
              {copy.footer.finalHeadline.accent}
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-[34rem] text-[1.0625rem] leading-[1.65] text-cream-300/75 md:text-[1.125rem]">
            {copy.footer.finalSubcopy}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticCta
              href={config.links.order}
              variant="primary"
              icon={<OrderBagIcon className="h-[1.15rem] w-[1.15rem]" />}
              withArrow
            >
              {copy.cta.orderLong}
            </MagneticCta>
            <MagneticCta
              href={config.links.catering}
              variant="outline"
              icon={<SparkIcon className="h-[1.05rem] w-[1.05rem]" />}
            >
              {copy.cta.cateringLong}
            </MagneticCta>
          </div>
        </Reveal>
      </div>

      {/* ---------- Columns ---------- */}
      <div className="shell relative">
        <div className="grid gap-10 border-t border-cream-200/12 py-12 md:grid-cols-3 md:gap-8 md:py-14">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-honey-400 text-toast-800">
                <WaffleMarkIcon className="h-[1.15rem] w-[1.15rem]" />
              </span>
              <span className="flex flex-col gap-1 leading-none">
                <span className="block text-[0.625rem] font-semibold tracking-[0.18em] text-cream-300/60 uppercase">
                  {config.wordmark.first}
                </span>
                <span className="display block text-[1.125rem] leading-none text-cream-100">
                  {config.wordmark.second}
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-[24rem] text-[0.9375rem] leading-[1.7] text-cream-300/70">
              {config.tagline} {copy.footer.brandBlurb}
            </p>
          </div>

          {/* Visit */}
          <div>
            <span className="eyebrow block text-cream-300/45">{copy.footer.visitLabel}</span>
            <address className="mt-4 text-[0.9375rem] leading-[1.75] text-cream-200/85 not-italic">
              {config.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <a
              href={config.map.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-honey-300 transition-colors duration-200 hover:text-honey-200"
            >
              <PinIcon className="h-4 w-4" />
              {copy.cta.getDirections}
            </a>

            <dl className="mt-6 space-y-1">
              {config.hours.schedule.map((h) => (
                <div key={h.days} className="text-[0.8125rem] text-cream-300/70">
                  <dt className="inline font-medium text-cream-200/85">{h.days}:</dt>{' '}
                  <dd className="inline tabular-nums">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Follow */}
          <div>
            {/* `block` matters: `.eyebrow` has no display of its own, and the
                handle below is an inline-flex anchor — left inline, the kicker
                sits *beside* the handle and its `mt-4` does nothing. The Visit
                column above only breaks because <address> is block-level. */}
            <span className="eyebrow block text-cream-300/45">{copy.footer.followLabel}</span>
            <a
              href={config.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex items-center gap-2.5 text-[1.0625rem] font-semibold text-cream-100 transition-colors duration-200 hover:text-honey-300"
            >
              <InstagramIcon className="h-[1.15rem] w-[1.15rem]" />@{config.instagramHandle}
            </a>
            <p className="mt-3 max-w-[22rem] text-[0.875rem] leading-[1.7] text-cream-300/65">
              {copy.footer.followBlurb}
            </p>

            <a
              href={config.links.order}
              className="mt-5 inline-flex items-center gap-2 text-[0.875rem] font-semibold text-honey-300 transition-colors duration-200 hover:text-honey-200"
            >
              <OrderBagIcon className="h-4 w-4" />
              {copy.cta.orderSentence}
            </a>
          </div>
        </div>

        {/* ---------- Fine print ---------- */}
        <div className="flex flex-col gap-4 border-t border-cream-200/12 py-7 text-[0.75rem] text-cream-300/50 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-1.5">
            <p>
              © {YEAR} {config.name}. {config.location.neighbourhood}, {config.location.city}.
            </p>
            {/* CC BY 4.0 obligation — attribution must ship on the live page. */}
            <p className="text-cream-300/40">
              3D waffle model{' '}
              <a
                href={MODEL_ATTRIBUTION.modelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-cream-300/25 underline-offset-2 transition-colors hover:text-cream-200"
              >
                “{MODEL_ATTRIBUTION.title}” by {MODEL_ATTRIBUTION.author}
              </a>{' '}
              ·{' '}
              <a
                href={MODEL_ATTRIBUTION.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-cream-300/25 underline-offset-2 transition-colors hover:text-cream-200"
              >
                {MODEL_ATTRIBUTION.licenseLabel}
              </a>
            </p>
          </div>
          <p className="max-w-[24rem] md:text-right">{copy.footer.finePrint}</p>
        </div>
      </div>

      {/* Space so the sticky order bar never covers the fine print. */}
      <div aria-hidden className="h-28 lg:hidden" />
    </footer>
  )
}
