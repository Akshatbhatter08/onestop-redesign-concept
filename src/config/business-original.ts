/**
 * ============================================================================
 * BUSINESS CONFIG — the single source of truth for THIS shop.
 * ============================================================================
 *
 * Everything that changes between businesses lives in the `business` object
 * below: identity, locale/currency, location, hours, links, proof points,
 * photos, an optional brand accent, and copy overrides. Section copy not set
 * here falls back to the shared, brand-neutral `defaultCopy` (see `defaults.ts`).
 *
 * `resolveConfig` merges those overrides, derives the Instagram/map/address
 * values from the raw fields, appends `@handle` to the marquee, and substitutes
 * `{city}` / `{neighbourhood}` tokens — so components read one flat, resolved
 * object and never touch defaults or derivation logic themselves.
 *
 * To spin up a new business: edit this object (and `../data/menu.ts` + the
 * photos below), drop the images into `public/`, and deploy. See the README.
 *
 * React-free: `vite.config.ts` imports `config` to inject the SEO head + accent
 * at build time.
 */

import type {
  BusinessConfig,
  PhotoItem,
  ProofPoint,
  SiteCopy,
} from './types'
import { defaultCopy } from './defaults'
import { formatMoney } from '../lib/format'
import { menu, DEFAULT_MENU_CATEGORY } from '../data/menu'

/** One Stop Waffle Shop — Belgian & Liège waffles in Toronto's Junction. */
const business: BusinessConfig = {
  name: 'One Stop Waffle Shop',
  wordmark: { first: 'One Stop', second: 'Waffle Shop' },
  tagline: "Authentic Belgian & Liège waffles in Toronto's Junction",
  shortDescription:
    "Fresh Belgian waffles, authentic Liège waffles, handcrafted milkshakes, and catering in Toronto's Junction. Order online for pickup or delivery.",

  locale: {
    lang: 'en-CA',
    ogLocale: 'en_CA',
    currency: 'CAD',
    currencyLocale: 'en-CA',
    appTitle: 'One Stop Waffle',
    priceRange: '$$',
    servesCuisine: ['Belgian Waffles', 'Liège Waffles', 'Desserts', 'Milkshakes', 'Coffee'],
  },

  location: {
    neighbourhood: 'The Junction',
    city: 'Toronto',
    region: 'ON',
    country: 'Canada',
    countryCode: 'CA',
    // TBD — exact street address not published; only the neighbourhood is
    // confirmed. Set `fullAddress` and flip `addressConfirmed` once verified.
    addressConfirmed: false,
    mapQuery: 'One Stop Waffle Shop, The Junction, Toronto, ON',
  },

  hours: {
    // TBD — UNVERIFIED. The uniform 9–5 / closed-Sunday pattern is the unedited
    // template default; `confirmed: false` surfaces the "(to confirm)" suffix.
    schedule: [
      { days: 'Monday — Saturday', time: '9:00 am – 5:00 pm' },
      { days: 'Sunday', time: 'Closed' },
    ],
    confirmed: false,
  },

  instagramHandle: 'onestopwaffleshop',
  links: {
    order: '#menu',
    catering: '#visit',
    loyalty: '#menu',
    // instagram + instagramDm derived from the handle in resolveConfig.
  },

  proof: [
    {
      kicker: 'Pressed to order',
      title: 'Every waffle made fresh, never pre-made',
      body: 'Nothing sits in a warmer. We prepare every order fresh — crisp, deep-pocketed, and finished with premium chocolate, fresh fruit, and locally loved flavours.',
    },
    {
      kicker: 'Belgian & Liège',
      title: 'Two authentic styles, done properly',
      body: 'Light, airy Belgian rounds and dense, caramelised Liège waffles studded with pearl sugar — traditional recipes, made the way they are back in Belgium.',
    },
    {
      kicker: 'Catering across Toronto',
      title: 'From one dessert to a thousand waffle pops',
      body: 'A live waffle station brings freshly pressed waffles to schools, businesses, weddings, and events — every order matters, whatever the size.',
    },
  ],

  photos: {
    mode: 'gallery',
    items: [
      {
        id: 'g1',
        src: '/waffle1.webp',
        alt: 'Belgian waffle piled with berries, banana, and red syrup',
        tone: { syrup: '#C21F38', tint: '#F3C9CF' },
        wide: true,
      },
      {
        id: 'g2',
        src: '/waffle2.webp',
        alt: 'Belgian waffle with mango, chocolate drizzle, and a scoop of ice cream',
        tone: { syrup: '#6B4423', tint: '#EBD3B4' },
      },
      {
        id: 'g3',
        src: '/waffle4.webp',
        alt: 'Waffle pop on a stick with cream, strawberries, and powdered sugar',
        tone: { syrup: '#C21F38', tint: '#F3C9CF' },
      },
      {
        id: 'g4',
        src: '/milkshake1.webp',
        alt: 'Strawberry milkshake with whipped cream and berry syrup',
        tone: { syrup: '#C21F38', tint: '#F3C9CF' },
      },
      {
        id: 'g5',
        src: '/coffee1.webp',
        alt: 'Takeaway coffee topped with whipped cream and chocolate drizzle',
        tone: { syrup: '#3E2415', tint: '#D9BFA8' },
      },
      {
        id: 'g6',
        src: '/waffle3.webp',
        alt: 'Belgian waffle with fruit, pistachio, chocolate, and ice cream',
        tone: { syrup: '#C98A12', tint: '#F7E3B0' },
        wide: true,
      },
    ],
  },

  // No `theme.accent` → the design system's berry accent stands untouched.

  copy: {
    brandDescriptor: 'Belgian · Liège',
    hero: {
      headlineLines: [['Authentic'], ['Belgian', '&', 'Liège'], ['waffles.']],
      accentWords: { Liège: 'text-honey-600', Belgian: 'text-toast-500' },
      subcopy:
        'Pressed fresh to order in Toronto’s Junction — deep-pocketed **Belgian** rounds, caramelised **Liège**, handcrafted milkshakes, and cozy hot drinks.',
    },
    marquee: [
      'Authentic Belgian waffles',
      'Liège pearl-sugar waffles',
      "Toronto's Junction",
      'Handcrafted milkshakes',
      'Catering & waffle pops',
    ],
    why: {
      body: 'Inspired by authentic Belgian waffles, we press every order fresh — traditional recipes met with creative toppings, premium chocolate, fresh fruit, and locally loved flavours. From a single after-dinner treat to catering a thousand waffle pops, every order matters to us.',
    },
    menu: {
      headline: { lead: 'Belgian, Liège, and', accent: 'a lot more.', accentClass: 'text-honey-600' },
      subcopy:
        'Pressed fresh when you order. Real items, real prices — tap anything to order on Square.',
    },
    visit: {
      headline: { lead: 'Find us in', accent: 'the Junction.', accentClass: 'text-honey-600' },
      addressNote:
        'Exact street address to be confirmed — the map pins our Junction neighbourhood for now.',
    },
    footer: {
      finalSubcopy:
        'Order online for pickup or delivery, swing by the Junction, or bring the live waffle station to your event — we cater across Toronto.',
    },
  },
}

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

/** The flat, fully-resolved config the app reads. */
export interface ResolvedConfig {
  name: string
  wordmark: { first: string; second: string }
  tagline: string
  shortDescription: string
  locale: BusinessConfig['locale']
  location: BusinessConfig['location']
  hours: BusinessConfig['hours']
  instagramHandle: string
  links: {
    order: string
    catering: string
    loyalty?: string
    instagram: string
    instagramDm: string
  }
  map: { embedSrc: string; directions: string }
  addressLines: string[]
  proof: ProofPoint[]
  photos: { mode: 'gallery' | 'social-cards'; items: PhotoItem[] }
  theme?: { accent?: string }
  copy: SiteCopy
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/** Deep-merge `over` onto `base`. Arrays replace wholesale; objects recurse. */
function mergeDeep<T>(base: T, over: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(over)) return (over as T) ?? base
  const out: Record<string, unknown> = { ...base }
  for (const key of Object.keys(over)) {
    const o = over[key]
    if (o === undefined) continue
    out[key] = isPlainObject(out[key]) && isPlainObject(o) ? mergeDeep(out[key], o) : o
  }
  return out as T
}

function fillTokens(str: string, tokens: Record<string, string>): string {
  return str.replace(/\{(\w+)\}/g, (_, key: string) => tokens[key] ?? `{${key}}`)
}

function resolveConfig(cfg: BusinessConfig): ResolvedConfig {
  const copy = mergeDeep(defaultCopy, cfg.copy)

  const tokens: Record<string, string> = {
    city: cfg.location.city,
    neighbourhood: cfg.location.neighbourhood,
    region: cfg.location.region,
    country: cfg.location.country,
    name: cfg.name,
  }
  // Only these fields carry {tokens}.
  copy.footer.brandBlurb = fillTokens(copy.footer.brandBlurb, tokens)
  copy.footer.finePrint = fillTokens(copy.footer.finePrint, tokens)
  copy.visit.addressNote = fillTokens(copy.visit.addressNote, tokens)
  copy.marquee = [...copy.marquee, `@${cfg.instagramHandle}`]

  const q = encodeURIComponent(cfg.location.mapQuery)
  const addressLines = cfg.location.fullAddress
    ? cfg.location.fullAddress.split('\n')
    : [cfg.location.neighbourhood, `${cfg.location.city}, ${cfg.location.region}`]

  const proof = cfg.proof.length
    ? cfg.proof
    : (cfg.differentiators ?? []).map((title) => ({ title }))

  return {
    name: cfg.name,
    wordmark: cfg.wordmark,
    tagline: cfg.tagline,
    shortDescription: cfg.shortDescription,
    locale: cfg.locale,
    location: cfg.location,
    hours: cfg.hours,
    instagramHandle: cfg.instagramHandle,
    links: {
      order: cfg.links.order,
      catering: cfg.links.catering,
      loyalty: cfg.links.loyalty,
      instagram: cfg.links.instagram ?? `https://instagram.com/${cfg.instagramHandle}`,
      instagramDm: cfg.links.instagramDm ?? `https://ig.me/m/${cfg.instagramHandle}`,
    },
    map: {
      embedSrc: `https://www.google.com/maps?q=${q}&output=embed`,
      directions: `https://www.google.com/maps/dir/?api=1&destination=${q}`,
    },
    addressLines,
    proof,
    photos: cfg.photos,
    theme: cfg.theme,
    copy,
  }
}

/** The resolved, app-wide config. Import this everywhere. */
export const config = resolveConfig(business)

/** Convenience alias — every component reads copy far more than anything else. */
export const copy = config.copy

/**
 * Format a menu price in the business's currency/locale. Undefined price →
 * the "See menu" fallback, so a category-only board never shows a fake number.
 */
export function formatPrice(price?: number, priceMax?: number): string {
  if (price == null) return config.copy.cta.seeMenu
  return formatMoney(price, priceMax, config.locale.currency, config.locale.currencyLocale)
}

// Menu data lives in ../data/menu.ts; re-exported so components have one import.
export { menu, DEFAULT_MENU_CATEGORY }
export type { MenuItem, MenuCategory } from '../data/menu'
