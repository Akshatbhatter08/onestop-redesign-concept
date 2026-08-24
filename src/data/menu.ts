/**
 * ============================================================================
 * MENU — live Square catalogue (CAD), transcribed from the shop's ordering page.
 * ============================================================================
 *
 * Tap-through still goes to their Square order flow. Photos we have live in
 * `public/`; items without a matching shot use the waffle glyph.
 */

export type MenuItem = {
  id: string
  name: string
  /** Price in CAD. */
  price: number
  /** Upper bound when Square lists a range (boxes, scoops, espresso). */
  priceMax?: number
  blurb?: string
  badge?: string
  featured?: boolean
  tone: { syrup: string; tint: string }
  image?: string
}

export type MenuCategory = {
  id: string
  name: string
  blurb?: string
  /** `list` is for canned drinks — a grid of waffle glyphs would look padded. */
  layout?: 'cards' | 'list'
  items: MenuItem[]
}

const T = {
  berry: { syrup: '#C21F38', tint: '#F3C9CF' },
  honey: { syrup: '#C77A18', tint: '#FBE0A6' },
  caramel: { syrup: '#B0641F', tint: '#F2D6AE' },
  cocoa: { syrup: '#6B4423', tint: '#EBD3B4' },
  pistachio: { syrup: '#6B7A32', tint: '#E4E3B0' },
  maple: { syrup: '#C98A12', tint: '#F8DFA4' },
  toast: { syrup: '#8A5A2B', tint: '#E7D3B0' },
  coffee: { syrup: '#3E2415', tint: '#D9BFA8' },
  cream: { syrup: '#C4A574', tint: '#F4E6D0' },
} as const

export function formatCad(price: number, priceMax?: number): string {
  const f = (n: number) =>
    `$${n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  if (priceMax != null && priceMax !== price) return `${f(price)}–${f(priceMax)}`
  return f(price)
}

export const menu: MenuCategory[] = [
  {
    id: 'limited',
    name: 'Limited Series',
    blurb: 'Weekend-only Liège — brioche dough, pearl sugar, caramelised edges.',
    items: [
      {
        id: 'liege-pearl',
        name: 'Original Pearl Sugar Liège Waffle',
        price: 8.99,
        badge: 'Weekend only',
        featured: true,
        tone: T.caramel,
        blurb:
          'Unlike our classic Belgian Brussels waffle, a Liège waffle is made with a rich, buttery brioche-style dough, studded with pearl sugar that caramelises on the iron.',
      },
    ],
  },
  {
    id: 'weekly',
    name: 'Waffle of the Week',
    blurb: 'The rotating special — this week it’s strawberries and shortbread.',
    items: [
      {
        id: 'strawberry-shortbread',
        name: 'Strawberry Shortbread',
        price: 15.49,
        badge: 'This week',
        featured: true,
        tone: T.berry,
        image: '/waffle1.webp',
        blurb:
          'A warm Belgian waffle layered with creamy white chocolate and fresh strawberries, topped with fluffy whipped cream.',
      },
    ],
  },
  {
    id: 'dessert',
    name: 'Dessert Waffles',
    blurb: 'The signature Belgian lineup — fruit, chocolate, maple, and build-your-own.',
    items: [
      {
        id: 'fruity',
        name: 'Fruity',
        price: 13.99,
        tone: T.berry,
        image: '/waffle1.webp',
        blurb:
          'A golden, crispy Belgian waffle topped with Nutella, stacked with fresh banana, strawberry, and berries.',
      },
      {
        id: 'smores',
        name: "S'mores Campfire",
        price: 11.99,
        tone: T.caramel,
        image: '/waffle5.webp',
        blurb:
          'A golden Belgian waffle loaded with Nutella, toasted marshmallows, graham cracker crumbs, and chocolate.',
      },
      {
        id: 'bora-bora',
        name: 'Bora Bora',
        price: 13.99,
        tone: T.cocoa,
        image: '/waffle2.webp',
        blurb:
          'This crispy Belgian waffle is layered with Nutella and topped with banana, pineapple, and mango.',
      },
      {
        id: 'choco-caramel',
        name: 'Choco Caramel',
        price: 14.99,
        tone: T.cocoa,
        image: '/waffle6.webp',
        blurb:
          'A golden Belgian waffle with a rich dark chocolate base, topped with fresh banana and strawberry.',
      },
      {
        id: 'classic-canadian',
        name: 'Classic Canadian',
        price: 15.49,
        badge: 'Signature',
        featured: true,
        tone: T.maple,
        image: '/waffle7.webp',
        blurb:
          'A golden Belgian waffle layered with rich maple syrup, topped with fresh slices of banana, strawberry, and berries.',
      },
      {
        id: 'everything',
        name: 'The Everything Waffle',
        price: 14.99,
        tone: T.pistachio,
        image: '/waffle3.webp',
        blurb:
          'This crispy Belgian waffle is stacked with a rich base of white chocolate and Nutella, then loaded with toppings.',
      },
      {
        id: 'mocha-coffee',
        name: 'Mocha Coffee',
        price: 14.99,
        tone: T.coffee,
        image: '/waffle8.webp',
        blurb:
          'A golden Belgian waffle with a white chocolate base, topped with banana, whipped cream, and mocha.',
      },
      {
        id: 'strawberry-banana-dream',
        name: 'Strawberry Banana Dream',
        price: 13.49,
        tone: T.berry,
        image: '/waffle9.webp',
        blurb:
          'A crisp, golden Belgian waffle with creamy Nutella, topped with fresh slices of banana and strawberry.',
      },
      {
        id: 'tropical-bliss',
        name: 'Tropical Bliss',
        price: 13.99,
        tone: T.honey,
        image: '/waffle10.webp',
        blurb:
          'A crispy Belgian waffle topped with a creamy white chocolate base, fresh banana and pineapple.',
      },
      {
        id: 'dubai-chocolate',
        name: 'Dubai Chocolate',
        price: 15.49,
        badge: 'Viral',
        featured: true,
        tone: T.pistachio,
        image: '/waffle11.webp',
        blurb:
          'The viral sensation, right here in the Junction. Our signature Dubai Chocolate Waffle — pistachio knafeh, chocolate, the whole thing.',
      },
      {
        id: 'very-berry',
        name: 'Very Berry Waffle',
        price: 14.99,
        tone: T.berry,
        image: '/waffle12.webp',
        blurb:
          'A golden Belgian waffle with a white chocolate base, topped with fresh strawberry, blueberry, and blackberry.',
      },
      {
        id: 'byo-waffle',
        name: 'Build Your Own Belgian Waffle',
        price: 8.5,
        badge: 'Your way',
        tone: T.honey,
        image: '/waffle13.webp',
        blurb:
          'Your waffle, your masterpiece. Start with a warm, golden Belgian waffle — crisp outside, fluffy inside — then pile on the toppings.',
      },
    ],
  },
  {
    id: 'combos',
    name: 'Combo Deals',
    items: [
      {
        id: 'combo-for-two',
        name: 'Combo for Two',
        price: 39.99,
        badge: 'Share',
        featured: true,
        tone: T.maple,
        image: '/waffle3.webp',
        blurb:
          'Two of our signature waffles paired with two creamy milkshakes. A sweet pick for sharing.',
      },
    ],
  },
  {
    id: 'pops',
    name: 'Waffle Pops',
    blurb: 'Handheld, party-ready, and the thing we cater by the hundred.',
    items: [
      {
        id: 'pop-rainbow',
        name: 'Rainbow',
        price: 5,
        tone: T.berry,
        blurb:
          'A crispy waffle pop coated in milk chocolate and covered with colourful sprinkles.',
      },
      {
        id: 'pop-cookies',
        name: 'Cookies and Cream',
        price: 5,
        tone: T.coffee,
        blurb:
          'A Belgian waffle pop coated with smooth white chocolate and generously topped with crushed cookies.',
      },
      {
        id: 'pop-strawberry',
        name: 'Strawberry Kiss',
        price: 5,
        tone: T.berry,
        image: '/waffle4.webp',
        blurb:
          'A crispy waffle pop coated in white chocolate, topped with fresh strawberry pieces and a drizzle of syrup.',
      },
      {
        id: 'pop-swirl',
        name: 'Chocolate Swirl',
        price: 5,
        tone: T.cocoa,
        blurb:
          'A crispy waffle pop layered with Nutella, white chocolate, milk chocolate, and a drizzle of pistachio.',
      },
      {
        id: 'pop-fruitella',
        name: 'Fruitella',
        price: 5,
        tone: T.honey,
        blurb:
          'A crispy waffle pop topped with Nutella, fresh banana and strawberry slices.',
      },
      {
        id: 'pop-byo',
        name: 'Build Your Own Belgian Waffle Pop',
        price: 3.9,
        badge: 'Your way',
        tone: T.toast,
        blurb:
          'Your waffle, your masterpiece. Start with a warm, golden Belgian waffle pop and finish it your way.',
      },
      {
        id: 'pop-half-dozen',
        name: 'Half Dozen Waffle Pop Box',
        price: 21.99,
        priceMax: 24.99,
        badge: 'Share',
        tone: T.honey,
        blurb:
          'Six freshly made waffle pops, topped with your choice of flavours and packed in a shareable box.',
      },
      {
        id: 'pop-dozen',
        name: 'Dozen Waffle Pop Box',
        price: 39.99,
        priceMax: 44.99,
        badge: 'Events',
        featured: true,
        tone: T.caramel,
        blurb:
          'Twelve freshly made waffle pops, topped with your choice of flavours and packed in a shareable box.',
      },
    ],
  },
  {
    id: 'plain',
    name: 'Plain Waffles',
    items: [
      {
        id: 'plain-waffle',
        name: 'Plain Waffle',
        price: 8.5,
        tone: T.toast,
        blurb:
          "Our batter is that good — these waffles don't need toppings. Plain waffles for $5 each when you add them on.",
      },
    ],
  },
  {
    id: 'milkshakes',
    name: 'Milkshakes',
    items: [
      {
        id: 'shake-biscoff',
        name: 'Biscoff Banana',
        price: 7.99,
        tone: T.caramel,
        blurb:
          'A dreamy combo of banana, vanilla ice cream, milk, and rich Biscoff spread, finished with whipped cream.',
      },
      {
        id: 'shake-nutella',
        name: 'Nutella Banana Bliss',
        price: 7.99,
        tone: T.cocoa,
        blurb:
          'A creamy blend of banana, vanilla ice cream, milk and Nutella, topped with whipped cream and a drizzle of chocolate.',
      },
      {
        id: 'shake-shortcake',
        name: 'Strawberry Shortcake',
        price: 7.99,
        badge: 'Bestseller',
        featured: true,
        tone: T.berry,
        image: '/milkshake1.webp',
        blurb:
          'A creamy blend of strawberry ice cream and buttery shortbread cookie crumbs, topped with whipped cream.',
      },
      {
        id: 'shake-oreo',
        name: 'Oreo Milkshake',
        price: 6.99,
        tone: T.coffee,
        blurb:
          'A creamy blend of vanilla ice cream, milk, and Oreo cookies, topped with fluffy whipped cream.',
      },
      {
        id: 'shake-coffee',
        name: 'Coffee Crush',
        price: 7.99,
        tone: T.coffee,
        image: '/coffee1.webp',
        blurb:
          'Creamy vanilla ice cream and bold espresso come together in this sweet pick-me-up, topped with whipped cream.',
      },
    ],
  },
  {
    id: 'icecream',
    name: 'Ice Cream',
    items: [
      {
        id: 'ice-cream-scoops',
        name: 'Ice Cream Scoops',
        price: 4.99,
        priceMax: 7.99,
        tone: T.cream,
        blurb: 'Proudly serving Kawartha Dairy ice cream.',
      },
    ],
  },
  {
    id: 'coffee',
    name: 'Coffee',
    items: [
      {
        id: 'americano',
        name: 'Americano',
        price: 3.99,
        tone: T.coffee,
        blurb:
          'A classic espresso-based coffee with hot water — smooth, rich, and bold. (10oz)',
      },
      {
        id: 'cappuccino',
        name: 'Cappuccino',
        price: 3.49,
        tone: T.cream,
        blurb:
          'A rich espresso topped with velvety steamed milk and a light layer of frothy foam. (8oz)',
      },
      {
        id: 'espresso',
        name: 'Espresso',
        price: 2.49,
        priceMax: 3.99,
        tone: T.coffee,
        blurb:
          'A small but powerful shot of rich, bold coffee with a smooth, velvety finish.',
      },
      {
        id: 'drip-coffee',
        name: 'Coffee',
        price: 1.99,
        tone: T.toast,
        blurb:
          'Freshly brewed, smooth, and aromatic. A classic cup of comfort. (10oz)',
      },
      {
        id: 'latte',
        name: 'Latte',
        price: 3.99,
        tone: T.cream,
        blurb:
          'A smooth blend of espresso and steamed milk, topped with a light layer of creamy foam. (12oz)',
      },
      {
        id: 'hot-chocolate',
        name: 'Hot Chocolate',
        price: 3.99,
        tone: T.cocoa,
        image: '/coffee1.webp',
        blurb:
          'Rich, velvety, and perfectly balanced — made with real melted chocolate and steamed milk.',
      },
      {
        id: 'salep',
        name: 'Salep',
        price: 3.99,
        badge: 'House special',
        tone: T.honey,
        blurb:
          'A traditional Turkish hot drink made from the powdered root of wild orchids — creamy, velvety, naturally sweet.',
      },
      {
        id: 'iced-coffee',
        name: 'Iced Coffee',
        price: 4.25,
        tone: T.coffee,
        blurb:
          'Freshly brewed coffee served over ice. Enjoy it black or customise with cream, milk, and syrup.',
      },
    ],
  },
  {
    id: 'drinks',
    name: 'Drinks',
    layout: 'list',
    items: [
      { id: 'coke', name: 'Coke', price: 1.5, tone: T.berry },
      { id: 'diet-coke', name: 'Diet Coke', price: 1.5, tone: T.coffee },
      { id: 'coke-zero', name: 'Coke Zero', price: 1.5, tone: T.coffee },
      { id: 'water', name: 'Bottled Water', price: 1.5, tone: T.cream },
      { id: 'sprite', name: 'Sprite', price: 1.5, tone: T.pistachio },
      { id: 'ginger-ale', name: 'Ginger Ale', price: 1.5, tone: T.pistachio },
      { id: 'fuze', name: 'Fuze Iced Tea', price: 1.5, tone: T.maple },
      { id: 'fresca', name: 'Fresca', price: 1.5, tone: T.honey },
      { id: 'bubly', name: 'Bubly', price: 1.5, tone: T.berry },
    ],
  },
]

/** First tab a visitor should land on — the full dessert board, not a one-item special. */
export const DEFAULT_MENU_CATEGORY = 'dessert'

/**
 * GALLERY — photos in `public/`. If a file is missing, Gallery falls back to
 * the waffle glyph currently used as placeholder art.
 */
export type GalleryShot = {
  id: string
  src?: string
  alt: string
  tone: { syrup: string; tint: string }
  wide?: boolean
}

export const gallery: GalleryShot[] = [
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
]
