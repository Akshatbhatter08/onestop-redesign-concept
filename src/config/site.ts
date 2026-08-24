/**
 * ============================================================================
 * SITE CONFIG — everything you'll want to change lives here.
 * ============================================================================
 *
 * This is a *pitch concept* for One Stop Waffle Shop (onestopwaffle.shop), a
 * Belgian & Liège waffle shop in Toronto's Junction. Content below was pulled
 * from their live site. Anything their public site doesn't expose (exact street
 * address, phone, per-item prices, confirmed hours) is marked `TBD — confirm`
 * rather than guessed. Grep `TBD` before sending this to the client.
 *
 * ▸ ORDER_URL   — their online-ordering destination (see note on the const)
 * ▸ HOURS       — UNVERIFIED (looks like a Weebly template default) — confirm
 * ▸ MAP_QUERY   — pins by business name; swap for the exact address once known
 */

/**
 * Online-ordering link.
 *
 * Their real order flow is Square online ordering, opened from onestopwaffle.shop.
 * There is no stable deep-link to it: `/order` 404s and the Square store
 * subdomain (onestopwaffleshoporder.square.site) just redirects back to the
 * homepage. So this points at the canonical site, which is guaranteed to work.
 *
 * TBD — confirm the exact Square online-ordering URL with the client and drop
 * it in here; every "Order Online" button on the site reads from this one const.
 */
export const ORDER_URL = 'https://www.onestopwaffle.shop'

/** Real, working pages on their live site (both return 200). */
export const CATERING_URL = 'https://www.onestopwaffle.shop/catering'
export const LOYALTY_URL = 'https://www.onestopwaffle.shop/loyalty-program'

/** Confirmed handle. */
export const INSTAGRAM_HANDLE = 'onestopwaffleshop'

export const site = {
  name: 'One Stop Waffle Shop',
  /** Used in the nav wordmark — split so we can style the second word. */
  wordmark: { first: 'One Stop', second: 'Waffle Shop' },
  tagline: "Authentic Belgian & Liège waffles in Toronto's Junction",

  area: 'The Junction',
  city: 'Toronto',
  /**
   * TBD — exact street address not published on their site (Square loads the
   * location at runtime). Only the neighbourhood is confirmed. Replace both
   * lines once the client confirms the street address + postal code.
   */
  addressLines: ['The Junction', 'Toronto, ON'],

  links: {
    order: ORDER_URL,
    catering: CATERING_URL,
    loyalty: LOYALTY_URL,
    instagram: `https://instagram.com/${INSTAGRAM_HANDLE}`,
    /** Official Instagram DM deep link — opens the app's chat thread. */
    instagramDm: `https://ig.me/m/${INSTAGRAM_HANDLE}`,
  },

  map: {
    /**
     * Keyless Google Maps embed. Pins by *business name* so Google resolves
     * their real listing without us inventing a street address. `output=embed`
     * needs no API key. TBD — swap the query for the exact address/plus code
     * once confirmed for a pin-perfect result.
     */
    embedSrc:
      'https://www.google.com/maps?q=' +
      encodeURIComponent('One Stop Waffle Shop, The Junction, Toronto, ON') +
      '&output=embed',
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=' +
      encodeURIComponent('One Stop Waffle Shop, The Junction, Toronto, ON'),
  },

  /**
   * TBD — UNVERIFIED HOURS. These are the values on their listing, but the
   * uniform 9–5 / closed-Sunday pattern is the unedited Weebly template default
   * and is atypical for a dessert shop. Confirm with the client before sending;
   * the UI labels them as unconfirmed so nothing here reads as a promise.
   */
  hours: [
    { days: 'Monday — Saturday', time: '9:00 am – 5:00 pm' },
    { days: 'Sunday', time: 'Closed' },
  ],

  /** Short trust points for the "why us" strip — grounded in their own copy. */
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
} as const

/** Marquee ticker copy — the strip under the hero. */
export const tickerItems = [
  'Authentic Belgian waffles',
  'Liège pearl-sugar waffles',
  "Toronto's Junction",
  'Handcrafted milkshakes',
  'Catering & waffle pops',
  `@${INSTAGRAM_HANDLE}`,
] as const
