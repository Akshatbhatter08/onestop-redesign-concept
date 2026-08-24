/**
 * ============================================================================
 * TEMPLATE TYPES — the shape of a single waffle-shop business instance.
 * ============================================================================
 *
 * One `BusinessConfig` fully describes one shop: identity, location, hours,
 * links, proof points, photos, and an optional per-brand accent. Section copy
 * (headlines, eyebrows, subcopy) has shared template defaults — see
 * `defaults.ts` — so a new business only overrides the strings that differ.
 *
 * Everything here is React-free on purpose: `vite.config.ts` imports the
 * resolved config to inject the SEO head at build time, so nothing in this
 * graph may import from `react`, `three`, or any component.
 */

export type Tone = { syrup: string; tint: string }

/** A "why us" trust point. `kicker`/`body` are optional so a business with only
 *  a flat bullet list (e.g. "100% eggless") can still populate the strip. */
export type ProofPoint = {
  kicker?: string
  title: string
  body?: string
}

/**
 * A section heading, split into a plain lead and an italic accent tail.
 * `accentClass` is the Tailwind text-color utility for the accent — the design
 * system's vocabulary (e.g. `text-berry-500`, `text-honey-600`), kept explicit
 * so each section renders exactly as designed.
 */
export type SectionHeadline = {
  lead: string
  accent: string
  accentClass: string
}

export type NavLink = { href: string; label: string }

/** A gallery photo or a social-proof card, depending on `photos.mode`. */
export type PhotoItem = {
  id: string
  /** Omit for placeholder art (gallery) or a text-only card (social-cards). */
  src?: string
  alt: string
  /** The post text — surfaced prominently in `social-cards` mode. */
  caption?: string
  tone: Tone
  /** Breaks the uniform grid rhythm (gallery mode). */
  wide?: boolean
}

/**
 * All user-facing copy that isn't raw business data. Every field has a
 * brand-neutral default in `defaults.ts`; a business overrides only what it
 * needs via `BusinessConfig.copy` (a deep-partial of this).
 */
export type SiteCopy = {
  /** Reused labels — one place so nav/hero/footer/sticky bar never drift. */
  cta: {
    orderLong: string
    orderShort: string
    orderSentence: string
    catering: string
    cateringLong: string
    directions: string
    directionsLabel: string
    getDirections: string
    orderThis: string
    tapToInteract: string
    swipeForMore: string
    seeMenu: string
  }
  nav: NavLink[]
  /** Short brand descriptor under the wordmark in the mobile order bar. */
  brandDescriptor: string
  hero: {
    /** Each inner array is one line; each string one word (word-level animation). */
    headlineLines: string[][]
    /** Word → Tailwind text-color class. Listed words get the italic accent cut. */
    accentWords: Record<string, string>
    /** Supports `**bold**` segments. */
    subcopy: string
  }
  /** Ticker strip under the hero. `@handle` is appended automatically. */
  marquee: string[]
  why: {
    eyebrow: string
    headline: SectionHeadline
    body: string
  }
  menu: {
    eyebrow: string
    headline: SectionHeadline
    subcopy: string
  }
  gallery: {
    eyebrow: string
    headline: SectionHeadline
    subcopy: string
  }
  visit: {
    eyebrow: string
    headline: SectionHeadline
    addressLabel: string
    hoursLabel: string
    /** Appended to the hours label when `hours.confirmed === false`. */
    unconfirmedSuffix: string
    /** Shown under the address when `location.addressConfirmed === false`.
     *  Supports `{neighbourhood}` / `{city}` tokens. */
    addressNote: string
  }
  footer: {
    finalEyebrow: string
    finalHeadline: SectionHeadline
    finalSubcopy: string
    /** Trails the tagline in the brand column. Supports `{city}` / `{neighbourhood}`. */
    brandBlurb: string
    visitLabel: string
    followLabel: string
    followBlurb: string
    /** Supports `{neighbourhood}` / `{city}` tokens. */
    finePrint: string
  }
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer _U>
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K]
}

export interface BusinessConfig {
  name: string
  /** Split so the nav/footer can style the two halves differently. */
  wordmark: { first: string; second: string }
  tagline: string
  /** One-liner used for the meta description and social cards. */
  shortDescription: string

  /** Locale, currency, and SEO scalars — feeds `formatPrice`, `<html lang>`,
   *  `og:locale`, and the JSON-LD block. */
  locale: {
    lang: string
    ogLocale: string
    /** ISO 4217, e.g. `CAD`, `USD`, `INR`. */
    currency: string
    /** BCP-47 tag for `Intl.NumberFormat`, e.g. `en-CA`. */
    currencyLocale: string
    /** `apple-mobile-web-app-title`. */
    appTitle: string
    priceRange?: string
    servesCuisine?: string[]
  }

  location: {
    neighbourhood: string
    city: string
    region: string
    country: string
    /** ISO 3166-1 alpha-2 for JSON-LD `addressCountry`, e.g. `CA`. */
    countryCode: string
    /** Filled once the street address is verified. */
    fullAddress?: string
    /** Drives the "to confirm" address note. */
    addressConfirmed: boolean
    /** What the map pins — a business name or a full address / plus code. */
    mapQuery: string
  }

  hours: {
    /** Optional single-line summary, e.g. "Mon–Sat 9am–5pm". */
    label?: string
    schedule: { days: string; time: string }[]
    note?: string
    /** `false` → the "(to confirm)" suffix appears wherever hours are shown. */
    confirmed: boolean
  }

  instagramHandle: string
  links: {
    order: string
    catering: string
    loyalty?: string
    /** Derived from `instagramHandle` when omitted. */
    instagram?: string
    /** Derived from `instagramHandle` when omitted. */
    instagramDm?: string
  }

  /** Rich "why us" cards. See also `differentiators` for the flat-list case. */
  proof: ProofPoint[]
  /** Optional flat list (e.g. ["100% eggless", "No additives"]) used to build
   *  proof cards when `proof` is empty — for businesses without long-form copy. */
  differentiators?: string[]

  photos: {
    mode: 'gallery' | 'social-cards'
    items: PhotoItem[]
  }

  /** Optional per-brand accent. A single hex overrides the design system's
   *  berry ramp (CTAs) via CSS variables — see `theme.ts`. Omit to keep berry. */
  theme?: { accent?: string }

  /** Per-business copy overrides, merged over the shared defaults. */
  copy?: DeepPartial<SiteCopy>
}
