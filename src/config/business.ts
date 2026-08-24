/**
 * ============================================================================
 * BUSINESS CONFIG — Northern Waffles
 * ============================================================================
 * Generated from their public Instagram (no website found). Several fields
 * are marked TBD below — verify before sending this as a live pitch link.
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

/** Northern Waffles — eggless, additive-free waffles in Etobicoke, Toronto. */
const business: BusinessConfig = {
  name: 'Northern Waffles',
  wordmark: { first: 'Northern', second: 'Waffles' },
  tagline: 'Where every bite feels special. Made with care, served with love.',
  shortDescription:
    '100% eggless waffles made fresh in-house with no artificial flavours or additives — open late in Etobicoke, Toronto, because cravings don\u2019t follow a schedule.',

  locale: {
    lang: 'en-CA',
    ogLocale: 'en_CA',
    currency: 'CAD',
    currencyLocale: 'en-CA',
    appTitle: 'Northern Waffles',
    priceRange: '$',
    servesCuisine: ['Waffles', 'Desserts'],
  },

  location: {
    neighbourhood: 'Etobicoke',
    city: 'Toronto',
    region: 'ON',
    country: 'Canada',
    countryCode: 'CA',
    // Confirmed — exact unit/street address as given.
    addressConfirmed: true,
    fullAddress: 'Unit 5, 2687 Kipling Ave\nEtobicoke, ON',
    mapQuery: 'Northern Waffles, 2687 Kipling Ave, Etobicoke, ON',
  },

  hours: {
    // Confirmed — taken directly from their Instagram.
    schedule: [
      { days: 'Monday — Thursday', time: '4:00 pm – 12:00 am' },
      { days: 'Friday — Sunday', time: '2:00 pm – 1:00 am' },
    ],
    confirmed: true,
  },

  // TBD — confirm the exact handle before deploying/sending.
  instagramHandle: 'northernwaffles',
  links: {
    order: '#menu',
    // TBD — no separate catering page found; pointing at Visit/Instagram DM
    // for now. Swap for a real ordering/catering URL once confirmed.
    catering: '#visit',
    loyalty: '#menu',
    // instagram + instagramDm derived from the handle in resolveConfig.
  },

  proof: [
    {
      kicker: 'No compromises',
      title: '100% eggless, always',
      body: 'Every waffle is made without artificial flavours or additives — 100% eggless, so more people can enjoy them without exception.',
    },
    {
      kicker: 'Fresh in-house',
      title: 'Made fresh, never shortcut',
      body: 'Nothing arrives pre-made. Every waffle is prepared in-house with care, the way it should be.',
    },
    {
      kicker: 'Late-night cravings',
      title: 'Because cravings don\u2019t follow a schedule',
      body: 'Open until midnight on weeknights and 1am on weekends — for whenever the craving actually hits.',
    },
  ],

  photos: {
    // Their Instagram is mostly text-over-graphic posts rather than clean
    // product photography — render these as social-proof cards, not a
    // product gallery. Replace the placeholder items below with real
    // screenshots (saved locally, e.g. /public/northern/ig-1.webp) before
    // deploying.
    mode: 'social-cards',
    items: [
      // {
      //   id: 'ig1',
      //   src: '/northern/ig-1.webp',
      //   alt: 'Northern Waffles Instagram post',
      //   caption: 'Where every bite feels special.',
      // },
    ] as PhotoItem[],
  },

  // No `theme.accent` set — using the shared design system's default accent.
  // Northern Waffles has no confirmed brand color from their Instagram; add
  // one here (e.g. `theme: { accent: '#...' }`) if you pull one from their
  // logo/highlight covers.

  copy: {
    brandDescriptor: 'Eggless · Fresh in-house',
    hero: {
      headlineLines: [['Where', 'every'], ['bite', 'feels'], ['special.']],
      accentWords: { special: 'text-honey-600' },
      subcopy:
        'Made with care, served with love — **100% eggless** waffles with no artificial flavours or additives, made fresh in-house in Etobicoke.',
    },
    marquee: [
      '100% eggless',
      'No artificial additives',
      'Made fresh in-house',
      'Etobicoke',
      'Open till 1am weekends',
    ],
    why: {
      body: 'Every waffle is made fresh in-house, 100% eggless, with no artificial flavours or additives — because what goes into it matters as much as how it tastes. And since cravings don\u2019t follow a schedule, we stay open late for whenever it hits.',
    },
    menu: {
      headline: { lead: 'Waffles, made', accent: 'the right way.', accentClass: 'text-honey-600' },
      subcopy:
        'Menu categories shown below — exact items and prices to be confirmed.',
    },
    visit: {
      headline: { lead: 'Find us in', accent: 'Etobicoke.', accentClass: 'text-honey-600' },
      addressNote: '',
    },
    footer: {
      finalSubcopy:
        'Order ahead or swing by Unit 5, 2687 Kipling Ave — open late, because cravings don\u2019t follow a schedule.',
    },
  },
}

// ---------------------------------------------------------------------------
// Resolution — identical to the shared template, do not edit per-business.
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