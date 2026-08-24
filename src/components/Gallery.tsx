import { useState } from 'react'
import { config, copy } from '../config/business'
import type { PhotoItem } from '../config/types'
import { Reveal, Stagger, StaggerItem } from './Reveal'
import { MagneticCta } from './MagneticCta'
import { WaffleGlyph } from './WaffleGlyph'
import { InstagramIcon } from './icons'
import { cx } from '../lib/cx'

/**
 * Instagram teaser. Deliberately grid-shaped so it reads as "their feed"
 * without embedding Instagram's script (which would cost more than the rest of
 * the page combined).
 *
 * Two modes, driven by `config.photos.mode`:
 *  - `gallery`     — image tiles (or waffle-glyph placeholders); two `wide`
 *                    tiles break the uniform 4-up rhythm. The photo-rich default.
 *  - `social-cards` — text-forward cards surfacing each post's `caption`, for a
 *                    business that has an Instagram voice but no photo library yet.
 */
export function Gallery() {
  const { mode, items } = config.photos
  const socialCards = mode === 'social-cards'

  return (
    <section id="gallery" className="relative isolate overflow-hidden py-20 md:py-28 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 -left-32 h-[380px] w-[380px] rounded-full bg-berry-300/18 blur-[100px]"
      />

      <div className="shell relative">
        {/* ---------- Header ---------- */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal className="max-w-[34rem]" y={24}>
            <span className="eyebrow text-honey-700">{copy.gallery.eyebrow}</span>
            <h2 className="display mt-4 text-[clamp(2.125rem,8.6vw,2.75rem)] text-toast-800 md:text-[3.25rem]">
              {copy.gallery.headline.lead}{' '}
              <span className={cx('display-accent', copy.gallery.headline.accentClass)}>
                {copy.gallery.headline.accent}
              </span>
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-[1.65] text-toast-500 md:text-[1.125rem]">
              {copy.gallery.subcopy}
            </p>
          </Reveal>

          <Reveal className="shrink-0" y={16} delay={0.1}>
            <MagneticCta
              href={config.links.instagram}
              variant="cream"
              size="md"
              icon={<InstagramIcon className="h-[1.05rem] w-[1.05rem]" />}
              withArrow
            >
              @{config.instagramHandle}
            </MagneticCta>
          </Reveal>
        </div>

        {/* ---------- Grid ---------- */}
        <Stagger
          className={cx(
            'mt-10 grid gap-2.5 md:mt-14 md:gap-4',
            socialCards
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-2 md:grid-cols-4',
          )}
          stagger={0.06}
        >
          {items.map((item, i) => (
            <StaggerItem
              key={item.id}
              className={cx(!socialCards && item.wide && 'col-span-2 md:col-span-2')}
            >
              {socialCards ? (
                <SocialCard item={item} index={i} />
              ) : (
                <GalleryTile item={item} index={i} />
              )}
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

/** Photo tile — real image when `src` is set, waffle-glyph placeholder otherwise. */
function GalleryTile({ item, index }: { item: PhotoItem; index: number }) {
  const [failed, setFailed] = useState(false)
  const showPhoto = Boolean(item.src) && !failed

  return (
    <a
      href={config.links.instagram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${item.alt} — open Instagram`}
      className={cx(
        'group relative block overflow-hidden rounded-[20px] shadow-soft ring-1 ring-toast-200/60 md:rounded-[24px]',
        item.wide ? 'aspect-[2/1.06]' : 'aspect-square',
      )}
      style={{ backgroundColor: item.tone.tint }}
    >
      {showPhoto ? (
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <WaffleGlyph
            syrup={item.tone.syrup}
            tint={item.tone.tint}
            detail={index % 3 === 0 ? 'full' : 'simple'}
            seed={index + 4}
            title={item.alt}
            className={cx(
              'transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.09]',
              item.wide ? 'w-[46%]' : 'w-[82%]',
            )}
          />
        </div>
      )}

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-toast-900/55 via-toast-900/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <span
        aria-hidden
        className="absolute bottom-3 left-3.5 flex items-center gap-1.5 text-[0.6875rem] font-semibold text-cream-50 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 md:translate-y-1.5"
      >
        <InstagramIcon className="h-3.5 w-3.5" />@{config.instagramHandle}
      </span>
    </a>
  )
}

/** Text-forward card — leads with the post `caption`, glyph as a soft watermark. */
function SocialCard({ item, index }: { item: PhotoItem; index: number }) {
  return (
    <a
      href={config.links.instagram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${item.alt} — open Instagram`}
      className="group relative flex min-h-[13rem] flex-col justify-between overflow-hidden rounded-[20px] p-5 shadow-soft ring-1 ring-toast-200/60 transition-shadow duration-500 hover:shadow-lift md:rounded-[24px] md:p-6"
      style={{ backgroundColor: item.tone.tint }}
    >
      {/* Glyph watermark, bled off the corner so the caption stays legible. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -bottom-8 opacity-25 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
      >
        <WaffleGlyph
          syrup={item.tone.syrup}
          tint={item.tone.tint}
          detail={index % 3 === 0 ? 'full' : 'simple'}
          seed={index + 4}
          className="w-36"
        />
      </div>

      <span className="relative flex items-center gap-1.5 text-[0.6875rem] font-semibold text-toast-600">
        <InstagramIcon className="h-3.5 w-3.5" />@{config.instagramHandle}
      </span>
      <p className="relative mt-4 text-[1rem] leading-[1.5] font-medium text-balance text-toast-800 md:text-[1.0625rem]">
        {item.caption ?? item.alt}
      </p>
    </a>
  )
}
