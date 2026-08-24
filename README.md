# Waffle Shop Template

A fast, animated, mobile-first marketing site for a waffle shop — 3D waffle hero,
smooth scrolling, and online ordering as the primary call to action. It's built
as a **template**: one shared design system, animation set, and 3D hero, with
every business-specific value pulled out into a single config file.

Spinning up a new shop means editing config and dropping in photos — **no
component touches required**. The design (cream/honey palette, berry CTA accent,
Fraunces + Plus Jakarta type, the waffle motifs and motion) stays constant unless
you deliberately override it.

The repo currently ships populated with **One Stop Waffle Shop** (Belgian & Liège
waffles in Toronto's Junction) as the worked example.

---

## Spin up a new business

Everything below is edited in **one file** unless noted. See [The config](#the-config)
for field-by-field detail.

1. **[`src/config/business.ts`](src/config/business.ts)** — replace the `business`
   object: name, wordmark, tagline, locale/currency, location, hours, Instagram
   handle, order/catering links, `proof` points, `photos`, and any `copy`
   overrides that differ from the shared defaults.
2. **[`src/data/menu.ts`](src/data/menu.ts)** — replace the `menu` array with the
   shop's categories and items. Set real `price` numbers, or omit them for a
   category-only board (the card shows a "See menu" pill instead of a fake price).
3. **`public/`** — drop in the referenced images (`image:` on menu items, `src:`
   on `photos.items`). Any that are missing fall back to generated waffle art, so
   the layout never looks broken — migrate photos one at a time.
4. **Optional — brand accent.** Set `theme.accent` to a single hex to recolour the
   CTAs; omit it to keep the design-system berry.
5. `npm run build`. The page title, meta description, social tags, and JSON-LD are
   generated from the config automatically (see [SEO](#seo)) — you never hand-edit
   `index.html`.

Sanity-check that nothing business-specific was left hardcoded:

```bash
grep -rn "TBD\|to confirm" src index.html
```

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

## The config

All business-specific content lives under [`src/config/`](src/config):

| File                                             | What it holds                                                        |
| ------------------------------------------------ | -------------------------------------------------------------------- |
| [`business.ts`](src/config/business.ts)          | **The one file you edit per shop.** The `business` object + resolver. |
| [`types.ts`](src/config/types.ts)                | The `BusinessConfig` / `SiteCopy` type contract.                     |
| [`defaults.ts`](src/config/defaults.ts)          | Brand-neutral default copy + the 3D-model attribution.               |
| [`theme.ts`](src/config/theme.ts)                | Derives the berry ramp from an optional `theme.accent`.              |
| [`../data/menu.ts`](src/data/menu.ts)            | The menu catalogue.                                                  |

`business.ts` exports a resolved `config` (and a `copy` alias). Components read
**only** from these — they never reach into defaults or derivation logic. The
resolver merges copy overrides, derives Instagram/map/address values, substitutes
`{city}` / `{neighbourhood}` tokens, and appends `@handle` to the marquee.

> **React-free by design.** Nothing under `src/config/` (or `src/data/menu.ts`,
> `src/lib/format.ts`) may import React, three, or a component — `vite.config.ts`
> imports the resolved config at build time to generate the SEO head, so the
> config graph has to load outside the browser.

### Defaults & overrides

Section copy — eyebrows, headlines, subcopy, reused button labels — has a shared,
brand-neutral default in [`defaults.ts`](src/config/defaults.ts) (no "Belgian",
no city, no neighbourhood). A business overrides **only the strings that differ**
via `business.copy`, a deep-partial of `SiteCopy` that's merged over the defaults.

So a plain shop can leave `copy` almost empty; One Stop overrides its hero
headline, marquee, menu/visit headlines, and a couple of others, and inherits the
rest. Headlines split into a `lead` + an italic `accent` tail with an explicit
`accentClass` (e.g. `text-honey-600`) so each section renders exactly as designed.

### Honest placeholders (the "to confirm" pattern)

Rather than invent details, the template surfaces unverified ones honestly, driven
by two booleans:

- **`hours.confirmed: false`** → the hours label everywhere gains a
  `(to confirm)` suffix (`copy.visit.unconfirmedSuffix`). Flip it to `true` once
  the trading hours are verified and the suffix disappears.
- **`location.addressConfirmed: false`** → the visit panel shows a short note that
  the map pins the neighbourhood, not a street address. Set `location.fullAddress`
  and flip this to `true` and the note is gone and the address block shows the
  real lines.

The map itself is keyless (`output=embed`, no API key), pinned by
`location.mapQuery` — a business name or a Plus Code / full address for an exact
pin.

### Menu

[`src/data/menu.ts`](src/data/menu.ts) is the catalogue: an array of categories,
each with `items`. Prices are optional and format through the business's
currency/locale:

```ts
{
  id: 'liege-classic',           // stable slug, used as the React key
  name: 'Classic Liège',         // shown on the card
  price: 6.5,                    // number — omit entirely for a "See menu" pill
  priceMax: 8.5,                 // optional upper bound → "$6.50–$8.50"
  featured: true,                // optional: richer placeholder art + spotlight
  blurb: 'Pearl-sugar dough, caramelised on the iron…',
  badge: 'Authentic',            // optional pill: Signature / Bestseller / …
  image: '/liege.webp',          // optional; omit for generated waffle art
  tone: { syrup: '#6B4423', tint: '#EBD3B4' },
}
```

`tone` drives the card's flavour tint and the placeholder art's syrup colour — any
CSS colour works. A category with `layout: 'list'` renders as a compact list (used
for canned drinks, where a grid of glyphs would look padded). `DEFAULT_MENU_CATEGORY`
sets which tab opens first. Add or remove items freely; the grid reflows
(1 → 2 → 3 → 4 columns) and the mobile carousel just gets longer.

Prices format through `formatPrice` in [`business.ts`](src/config/business.ts),
which is bound to `locale.currency` + `locale.currencyLocale` — so `CAD` + `en-CA`
yields `$6.50`, `USD` + `en-US` yields `$6.50`, `INR` + `en-IN` yields `₹6.50`,
with no per-component changes.

### Photos: gallery vs social-cards

`photos.mode` picks how the Instagram-teaser section renders its `items`:

- **`gallery`** — image tiles (or waffle-glyph placeholders when `src` is omitted);
  set `wide: true` to break the uniform grid rhythm. The photo-rich default.
- **`social-cards`** — text-forward cards that lead with each item's `caption`, for
  a shop that has an Instagram voice but no photo library yet.

Both link to the shop's Instagram. Migrate from cards to gallery by switching the
mode and adding `src`s.

### Brand accent

The design system's **berry** accent (CTAs, links, highlights) is shared. To
recolour it per brand, set a single hex:

```ts
theme: { accent: '#7A5CFF' }
```

At build time [`theme.ts`](src/config/theme.ts) derives a full 300–700 ramp from
that hue and redefines the `--color-berry-*` CSS variables (and the CTA shadow) via
an injected `<style>`. Omit `theme` (or `theme.accent`) and nothing is injected —
the berry ramp stands untouched. The rest of the palette (cream/honey neutrals) is
intentionally not themeable; it's the template's identity.

### SEO

[`index.html`](index.html) holds a marked block:

```html
<!-- SEO:START --> … <!-- SEO:END -->
```

The `inject-seo` plugin in [`vite.config.ts`](vite.config.ts) replaces it — in both
dev and build — with a title (`name — tagline`), meta description
(`shortDescription`), Open Graph + Twitter tags, and a `Restaurant` JSON-LD block,
all derived from the config. It also rewrites `<html lang>` from `locale.lang`.
**Don't hand-edit the block**; the values inside it are a readable fallback that
mirror what the plugin generates.

Two things worth adding before you share a link: `og:image` (a 1200×630 shot in
`public/` plus a `<meta property="og:image">`), and — once confirmed — `telephone`,
`geo`, and `openingHoursSpecification` in the JSON-LD (extend `buildSeoBlock` in
`vite.config.ts`).

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
├── config/
│   ├── business.ts        ← THE per-shop file: business data + resolver
│   ├── types.ts               BusinessConfig / SiteCopy contract
│   ├── defaults.ts            shared brand-neutral copy + model attribution
│   └── theme.ts               optional brand-accent → berry ramp
├── data/menu.ts           ← menu catalogue
├── hooks/
│   ├── useCanRender3D.ts      WebGL + device probe, and the idle gate
│   ├── useInteractions.ts     useMagnetic, useTilt
│   └── useMediaQuery.ts       usePrefersReducedMotion, useHasFinePointer
├── lib/                   motion variants/easings (motion.ts), cx, formatMoney
└── index.css              Tailwind v4 theme + waffle-grid / grain / shine motifs
```

**Tailwind is v4** — configured in CSS, not JS. The palette, fonts, shadows and
keyframes live in the `@theme` block at the top of
[`src/index.css`](src/index.css). There is deliberately no `tailwind.config.js`
and no PostCSS config; `@tailwindcss/vite` handles it. Because v4 compiles utilities
to CSS custom properties (`bg-berry-500` → `var(--color-berry-500)`), the brand
accent can be re-themed just by redefining those variables (see [Brand accent](#brand-accent)).

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

> **Attribution is shipped, and must stay that way.** CC BY requires the credit to
> remain visible **on the live site**, not just in this README — so it's rendered
> in the page footer (fine-print row) from `MODEL_ATTRIBUTION` in
> [`src/config/defaults.ts`](src/config/defaults.ts). It's deliberately part of the
> shared defaults, not per-business copy, so it can't be dropped when a new shop is
> configured. Keep that credit line in place across every business, and leave
> `public/models/license.txt` alongside the model if present.

To swap in a different model, drop its `scene.gltf` + `.bin` into `public/models/`
and update `MODEL_ATTRIBUTION` to match its licence. `WaffleGLTF` re-centres and
re-scales whatever it loads, so a replacement needn't match the original's
dimensions or origin.
