# One Stop Waffle Shop — pitch concept

A design concept for **[One Stop Waffle Shop](https://onestopwaffle.shop)** —
authentic **Belgian & Liège waffles**, milkshakes, and catering in **Toronto's
Junction**.

This is a **pitch build**, not their live site: it reimagines their Square
Online storefront as a fast, animated, mobile-first single page. Mobile-first
(designed at 390px, then scaled up), with a 3D waffle hero, Lenis smooth
scrolling, and their online store as the primary order channel.

> **Real vs. placeholder** — this concept uses their real business name,
> neighbourhood, menu **categories**, Instagram, and About copy. A few details
> aren't publicly recoverable and are marked as **TBD** in the UI and here — see
> [What's real vs. TBD](#whats-real-vs-tbd). Nothing was invented to look
> finished.

---

## Run it

Requires **Node 20.19+ or 22.12+** (Vite 7).

```bash
npm install
```

```bash
npm run dev
```

Opens at <http://localhost:5173>.

| Script              | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Dev server with HMR                             |
| `npm run build`     | Typecheck, then production build to `dist/`     |
| `npm run preview`   | Serve the built `dist/` locally                 |
| `npm run typecheck` | `tsc --noEmit` on its own                       |

---

## What's real vs. TBD

All content lives in two files: [`src/config/site.ts`](src/config/site.ts)
(business details, links, hours, map) and [`src/data/menu.ts`](src/data/menu.ts)
(menu + gallery).

### Real — pulled from their live site

- **Name, neighbourhood, positioning** — One Stop Waffle Shop, Toronto's
  Junction; Belgian & Liège waffles, milkshakes, hot drinks, and catering.
- **Menu categories** — Belgian Dessert Waffles, Liège Waffles, Savoury Waffles,
  Waffle Pops, Combo Deals, Handcrafted Milkshakes, Ice Cream, Coffee & Hot
  Drinks. These are their real categories.
- **About / "why us" copy** — adapted from their own site (authentic Belgian
  waffles, pressed fresh to order, catering up to a thousand waffle pops).
- **Instagram** — [@onestopwaffleshop](https://www.instagram.com/onestopwaffleshop).
- **Order & catering links** — their online store and `/catering` page.

### TBD — not publicly recoverable, marked as placeholder

Their storefront loads prices, address, phone and hours at runtime from Square's
API, so none of it is in the static page. Rather than invent it, the concept
shows it as clearly-labelled placeholder:

- **Exact street address** — the map pins the Junction neighbourhood by name; a
  visible note says the street address is to be confirmed.
- **Per-item names & CAD prices** — the menu shows real *categories* with a
  "See menu" pill and a note that items/prices sync live from their Square
  catalogue.
- **Trading hours** — shown under a **"Hours (to confirm)"** label.
- **Exact online-ordering deep link** — points at their homepage for now (their
  `/order` path 404s and the Square store redirects); swap in the real deep link
  when confirmed.

Grep for anything still flagged:

```bash
grep -rn "TBD\|to confirm\|placeholder" src index.html
```

### When the real details land

**[`src/config/site.ts`](src/config/site.ts)** is the hub. Update:

- **`ORDER_URL`** — the exact online-ordering deep link (feeds every "Order"
  button: nav, hero, menu cards, sticky mobile bar, location panel, footer).
- **`addressLines`** + **`map`** — add the street address, and switch the map
  `query` from the neighbourhood name to the shop's Plus Code or Google Business
  listing for an exact pin.
- **`hours`** — replace the placeholder trading hours (and drop the "to confirm"
  labels in `LocationMap`).

Then in **[`src/data/menu.ts`](src/data/menu.ts)**, add real item names and CAD
prices. Set `price` (a number, CAD) on an item and the card shows it; leave it
`undefined` and the card falls back to the "See menu" pill:

```ts
{
  id: 'liege-classic',           // stable slug, used as the React key
  name: 'Classic Liège',         // shown on the card
  price: 6.5,                    // CAD, number not string — omit for "See menu"
  featured: true,                // optional: richer placeholder art + spotlight
  blurb: 'Pearl-sugar dough, caramelised on the iron…',
  badge: 'Authentic',            // optional pill: Signature / Bestseller / …
  tone: { syrup: '#6B4423', tint: '#EBD3B4' },
}
```

`tone` drives the card's flavour tint and the placeholder art's syrup colour —
any CSS colour works. Add or remove items freely; the grid reflows
(1 → 2 → 3 → 4 columns) and the mobile carousel just gets longer.

### Real photos

Both the menu and the gallery ship with generated SVG waffle art so the layout
never looks broken. Swap either by dropping files into `public/` and pointing at
them:

| What    | Put files in       | Then set                                     |
| ------- | ------------------ | -------------------------------------------- |
| Menu    | `public/menu/`     | `image: '/menu/liege.jpg'` on the item       |
| Gallery | `public/gallery/`  | `src: '/gallery/01.jpg'` on the shot         |

Both live in **[`src/data/menu.ts`](src/data/menu.ts)**. Leave the field
`undefined` and the placeholder art renders instead — so you can migrate one
photo at a time. Square-ish crops for the gallery (two tiles are `wide: true`);
menu cards crop to 4:5 portrait, `object-cover`. Update the `alt` text as you go.

### Also worth updating

Still in **[`src/config/site.ts`](src/config/site.ts)**:

- **`proof`** — the three trust points in the "why us" strip.
- **`tickerItems`** — the scrolling strip under the hero.

And in **[`index.html`](index.html)**:

- The `Restaurant` JSON-LD block near the bottom. Add `streetAddress`,
  `telephone`, `geo`, and `openingHoursSpecification` once confirmed — it's what
  Google reads for the local knowledge panel.
- `og:image` is deliberately absent. Add a 1200×630 shot in `public/` and a
  `<meta property="og:image">` tag before sharing the link anywhere.

---

## How it's put together

```
src/
├── three/                 ← lazy chunk: nothing outside here imports three.js
│   ├── WaffleScene.tsx        Canvas, lighting rig, scroll-driven Rig
│   └── WaffleGLTF.tsx         loads /models/scene.gltf, re-centres + scales it
├── components/
│   ├── Hero.tsx               3D stage, headline, both CTAs
│   ├── HeroWaffleFallback.tsx static hero (loading + reduced-motion + no-WebGL)
│   ├── Nav.tsx  Marquee.tsx  WhyUs.tsx
│   ├── MenuGrid.tsx  MenuCard.tsx
│   ├── Gallery.tsx  LocationMap.tsx
│   ├── StickyOrderBar.tsx  Footer.tsx
│   ├── SmoothScroll.tsx       Lenis provider
│   └── … Reveal, Stagger, MagneticCta, WaffleGlyph, Grain
├── config/site.ts         ← business details, links, hours, map
├── data/menu.ts           ← menu + gallery content
├── hooks/
│   ├── useCanRender3D.ts      WebGL + device probe, and the idle gate
│   ├── useInteractions.ts     useMagnetic, useTilt
│   └── useMediaQuery.ts       usePrefersReducedMotion, useHasFinePointer
├── lib/                   motion variants/easings (motion.ts), cx (cx.ts)
└── index.css              Tailwind v4 theme + waffle-grid / grain / shine motifs
```

**Tailwind is v4** — configured in CSS, not JS. The palette, fonts, shadows and
keyframes live in the `@theme` block at the top of
[`src/index.css`](src/index.css). There is deliberately no `tailwind.config.js`
and no PostCSS config; `@tailwindcss/vite` handles it.

### The 3D hero

A glTF waffle (`public/models/scene.gltf` + `scene.bin`) loaded through drei's
`useGLTF`. On mount, `WaffleGLTF` measures the model's real world-space bounding
box, recenters it on the origin, and scales its widest horizontal axis to a
fixed **2.72 units** — so the rig's camera, vertical offsets, and scroll
parallax are all independent of whatever transforms the export happened to bake
in. Lighting is a `Lightformer` environment baked once (`frames={1}`), so the
glossy syrup gets real reflections with no HDR download.

It's also the one thing on the page that could plausibly hurt a mid-range phone,
so it's fenced off:

- **Lazy-loaded.** `React.lazy(() => import('../three/WaffleScene'))` in
  `Hero.tsx` is the only route into `src/three/`. The three.js chunk (now
  including drei's glTF loader) and the model itself (~1 MB) load as separate
  files that never touch first paint; `useGLTF.preload` warms the model fetch
  the moment that chunk evaluates.
- **Fetched on idle**, after `requestIdleCallback` — so it queues behind fonts
  and the initial render, not in front of them.
- **Gated on a capability probe** ([`src/hooks/useCanRender3D.ts`](src/hooks/useCanRender3D.ts)):
  a real WebGL context test, plus `hardwareConcurrency`, `deviceMemory`,
  `saveData`, `prefers-reduced-data` and `prefers-reduced-motion`. Fail any and
  the chunk is never requested — `HeroWaffleFallback` becomes the permanent
  hero instead of a loading poster.
- **Parked when off-screen.** `frameloop="never"` once the hero scrolls away, so
  the GPU is idle while someone reads the menu.
- **DPR-adaptive.** `PerformanceMonitor` drops the pixel ratio from 1.7 → 1 if
  frames start slipping.
- **`pointer-events: none`.** The canvas can't swallow a tap or a scroll, so
  cursor parallax reads from a window-level `pointermove` listener rather than
  raycasting.

To check the fallback path without a low-end device: turn on "Reduce motion" in
your OS accessibility settings and reload. macOS: System Settings → Accessibility
→ Display. Windows 11: Settings → Accessibility → Visual effects → Animation
effects.

### Motion

Lenis drives the scroll; Framer Motion does everything else. Two rules the code
sticks to:

1. **Only `transform` and `opacity` animate.** No `width`, `height`, `top`, or
   `box-shadow` transitions anywhere — those trip layout and paint.
2. **`prefers-reduced-motion` is honoured everywhere**, not just the hero.
   `usePrefersReducedMotion` swaps every reveal for a plain opacity fade, stops
   the marquee, and disables magnetic hover and card tilt.

Tilt and magnetic hover are pointer-only by design — on touch they'd fight the
tap. Cards get `whileTap` scale instead.

Lenis' stock CSS includes `iframe { pointer-events: none }`, which is
intentionally **not** in `index.css` — the map needs to be interactive. Instead
`LocationMap` puts a "Tap to interact" shield over the iframe until you click it,
so the map can't hijack a scroll on mobile but is still usable.

---

## Responsive

Built and laid out against four widths: **390** (iPhone 14/15 baseline), **768**,
**1024**, **1440** — all four checked in a live browser (no horizontal overflow at
any of them, and the 3D hero framed at each). They map to Tailwind's `md` / `lg` /
`xl` breakpoints below.

Layout shifts worth knowing:

| Breakpoint | What changes                                                        |
| ---------- | ------------------------------------------------------------------- |
| `< 768px`  | Menu is a swipeable snap carousel; 3D hero is a band below the copy |
| `≥ 768px`  | Menu becomes a 2-col grid; gallery goes 4-col                       |
| `≥ 1024px` | Nav links appear; sticky order bar hides; 3D moves to a right column |
| `≥ 1280px` | Menu grid goes 4-col                                                |

The sticky order bar is mobile/tablet only (`lg:hidden`) — desktop keeps the
nav button in view instead. It appears after ~72% of a viewport height of scroll,
with hysteresis so it can't flicker at the threshold, and respects
`env(safe-area-inset-bottom)` on notched phones.

---

## Deploying

Static output — any host works.

```bash
npm run build
```

Then serve `dist/`. On Netlify or Vercel the defaults are correct (build
`npm run build`, publish `dist`). It's a single-page app with no router, so no
redirect rules are needed.

**Fonts** load from Google Fonts (Fraunces + Plus Jakarta Sans). That's one
third-party connection on first paint; `index.html` preconnects to both origins
and uses `display=swap`, so text is never invisible. If you'd rather not depend
on Google — or need the site to work behind a restrictive network — self-host via
[fontsource](https://fontsource.org) and drop the two `<link>` tags.

---

## Credits

The 3D hero model — **"Belgian waffles draft"** by **Rixael** — comes from
Sketchfab under **[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)**:

<https://sketchfab.com/3d-models/belgian-waffles-draft-a8d00d5e6f6f4703ae41fd146025cd2c>

> **Attribution is shipped.** CC BY requires the credit to stay visible **on the
> live site**, not just in this README — so it's rendered in the page footer
> (fine-print row). Keep that credit line in place, and leave
> `public/models/license.txt` alongside the model if present.

To swap in a different model, drop its `scene.gltf` + `.bin` into
`public/models/` and update this credit. `WaffleGLTF` re-centres and re-scales
whatever it loads, so a replacement needn't match the original's dimensions or
origin.
