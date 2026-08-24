import { useState } from 'react'
import { gallery, type GalleryShot } from '../data/menu'
import { INSTAGRAM_HANDLE, site } from '../config/site'
import { Reveal, Stagger, StaggerItem } from './Reveal'
import { MagneticCta } from './MagneticCta'
import { WaffleGlyph } from './WaffleGlyph'
import { InstagramIcon } from './icons'
import { cx } from '../lib/cx'

/**
 * Instagram teaser. Deliberately grid-shaped so it reads as "their feed"
 * without embedding Instagram's script (which would cost more than the rest of
 * the page combined). Two `wide` tiles break the uniform 4-up rhythm.
 */
export function Gallery() {
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
            <span className="eyebrow text-honey-700">The feed</span>
            <h2 className="display mt-4 text-[clamp(2.125rem,8.6vw,2.75rem)] text-toast-800 md:text-[3.25rem]">
              Proof, in{' '}
              <span className="display-accent text-berry-500">syrup.</span>
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-[1.65] text-toast-500 md:text-[1.125rem]">
              Today’s specials, the odd experiment, and whatever the regulars talked
              us into. All of it lands on Instagram first.
            </p>
          </Reveal>

          <Reveal className="shrink-0" y={16} delay={0.1}>
            <MagneticCta
              href={site.links.instagram}
              variant="cream"
              size="md"
              icon={<InstagramIcon className="h-[1.05rem] w-[1.05rem]" />}
              withArrow
            >
              @{INSTAGRAM_HANDLE}
            </MagneticCta>
          </Reveal>
        </div>

        {/* ---------- Grid ---------- */}
        <Stagger
          className="mt-10 grid grid-cols-2 gap-2.5 md:mt-14 md:grid-cols-4 md:gap-4"
          stagger={0.06}
        >
          {gallery.map((shot, i) => (
            <StaggerItem
              key={shot.id}
              className={cx(shot.wide && 'col-span-2 md:col-span-2')}
            >
              <GalleryTile shot={shot} index={i} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function GalleryTile({ shot, index }: { shot: GalleryShot; index: number }) {
  const [failed, setFailed] = useState(false)
  const showPhoto = Boolean(shot.src) && !failed

  return (
    <a
      href={site.links.instagram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${shot.alt} — open Instagram`}
      className={cx(
        'group relative block overflow-hidden rounded-[20px] shadow-soft ring-1 ring-toast-200/60 md:rounded-[24px]',
        shot.wide ? 'aspect-[2/1.06]' : 'aspect-square',
      )}
      style={{ backgroundColor: shot.tone.tint }}
    >
      {showPhoto ? (
        <img
          src={shot.src}
          alt={shot.alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <WaffleGlyph
            syrup={shot.tone.syrup}
            tint={shot.tone.tint}
            detail={index % 3 === 0 ? 'full' : 'simple'}
            seed={index + 4}
            title={shot.alt}
            className={cx(
              'transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.09]',
              shot.wide ? 'w-[46%]' : 'w-[82%]',
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
        <InstagramIcon className="h-3.5 w-3.5" />@{INSTAGRAM_HANDLE}
      </span>
    </a>
  )
}
