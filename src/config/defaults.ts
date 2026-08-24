/**
 * ============================================================================
 * TEMPLATE DEFAULTS — brand-neutral copy shared by every business.
 * ============================================================================
 *
 * `defaultCopy` is the fallback voice: generic enough for any waffle shop, with
 * NO business-specific terms (no "Belgian", "Liège", neighbourhood, or city).
 * A business overrides only the strings that differ via `BusinessConfig.copy`;
 * `resolveConfig` deep-merges its overrides over these defaults.
 *
 * Token strings (`{city}`, `{neighbourhood}`) are substituted in `resolveConfig`
 * from the business's `location`, so a shop that keeps the default copy still
 * reads correctly.
 *
 * React-free — safe to import from `vite.config.ts` for build-time SEO.
 */

import type { SiteCopy } from './types'

export const defaultCopy: SiteCopy = {
  cta: {
    orderLong: 'Order Online',
    orderShort: 'Order',
    orderSentence: 'Order online',
    catering: 'Catering',
    cateringLong: 'Catering & events',
    directions: 'Directions',
    directionsLabel: 'Get directions to the shop',
    getDirections: 'Get directions',
    orderThis: 'Order this',
    tapToInteract: 'Tap to interact',
    swipeForMore: 'Swipe for more →',
    seeMenu: 'See menu',
  },

  nav: [
    { href: '#why', label: 'Why us' },
    { href: '#menu', label: 'Menu' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#visit', label: 'Visit' },
  ],

  brandDescriptor: 'Pressed fresh',

  hero: {
    headlineLines: [['Fresh'], ['waffles,'], ['made', 'to', 'order.']],
    accentWords: { 'order.': 'text-honey-600' },
    subcopy:
      'Pressed fresh to order — crisp, golden, and finished with **premium** toppings, handcrafted milkshakes, and cozy hot drinks.',
  },

  marquee: [
    'Freshly pressed waffles',
    'Handcrafted milkshakes',
    'Cozy hot drinks',
    'Catering & events',
  ],

  why: {
    eyebrow: 'Why us',
    headline: {
      lead: 'A waffle should be more than',
      accent: 'just dessert.',
      accentClass: 'text-berry-500',
    },
    body: 'We press every order fresh — traditional recipes met with creative toppings, premium chocolate, and fresh fruit. From a single after-dinner treat to catering by the hundred, every order matters to us.',
  },

  menu: {
    eyebrow: 'The menu',
    headline: {
      lead: 'Fresh waffles, and',
      accent: 'a lot more.',
      accentClass: 'text-honey-600',
    },
    subcopy:
      'Pressed fresh when you order. Real items, real prices — tap anything to order.',
  },

  gallery: {
    eyebrow: 'The feed',
    headline: { lead: 'Proof, in', accent: 'syrup.', accentClass: 'text-berry-500' },
    subcopy:
      'Today’s specials, the odd experiment, and whatever the regulars talked us into. All of it lands on Instagram first.',
  },

  visit: {
    eyebrow: 'Come by',
    headline: {
      lead: 'Find us in',
      accent: 'the neighbourhood.',
      accentClass: 'text-honey-600',
    },
    addressLabel: 'Address',
    hoursLabel: 'Hours',
    unconfirmedSuffix: ' (to confirm)',
    addressNote:
      'Exact street address to be confirmed — the map pins our {neighbourhood} neighbourhood for now.',
  },

  footer: {
    finalEyebrow: 'Last thing',
    finalHeadline: {
      lead: 'One tap and it’s',
      accent: 'fresh off the iron.',
      accentClass: 'text-honey-300',
    },
    finalSubcopy:
      'Order online for pickup or delivery, swing by the shop, or bring the live waffle station to your event.',
    brandBlurb: '— pressed fresh to order in {city}.',
    visitLabel: 'Visit',
    followLabel: 'Follow',
    followBlurb: 'Daily specials, new drops, and behind-the-counter waffle experiments.',
    finePrint: 'Pickup in {neighbourhood} · Order online anytime.',
  },
}

/**
 * 3D hero model credit. About the *model*, not any business — CC BY 4.0
 * requires this attribution ship visibly wherever the model is used, so it
 * stays constant across every business built from this template.
 */
export const MODEL_ATTRIBUTION = {
  title: 'Belgian waffles draft',
  author: 'Rixael',
  modelUrl:
    'https://sketchfab.com/3d-models/belgian-waffles-draft-a8d00d5e6f6f4703ae41fd146025cd2c',
  licenseLabel: 'CC BY 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
} as const
