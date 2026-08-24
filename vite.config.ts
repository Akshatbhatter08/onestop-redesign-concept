import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { config } from './src/config/business'
import { accentStyleCss } from './src/config/theme'

/** HTML-escape a value for use in an attribute or text node. */
const esc = (v: string) =>
  v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/**
 * Build the contents of the `<!-- SEO:START -->…<!-- SEO:END -->` block from the
 * resolved business config: page title, meta description, social tags, and the
 * Restaurant JSON-LD. Keeping this derived means a new business only edits
 * `src/config/business.ts` — never the HTML.
 */
function buildSeoBlock(): string {
  const title = `${config.name} — ${config.tagline}`
  const desc = config.shortDescription

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: config.name,
  }
  if (config.locale.servesCuisine?.length) jsonLd.servesCuisine = config.locale.servesCuisine
  if (config.locale.priceRange) jsonLd.priceRange = config.locale.priceRange
  const address: Record<string, string> = {
    '@type': 'PostalAddress',
    addressLocality: config.location.city,
    addressRegion: config.location.region,
    addressCountry: config.location.countryCode,
  }
  if (config.location.fullAddress) address.streetAddress = config.location.fullAddress
  jsonLd.address = address
  jsonLd.sameAs = [config.links.instagram]

  // Two-space indent matches the surrounding <head> block for a tidy build output.
  const ld = JSON.stringify(jsonLd, null, 2)
    .split('\n')
    .map((line) => `      ${line}`)
    .join('\n')

  return [
    `<title>${esc(title)}</title>`,
    `    <meta name="description" content="${esc(desc)}" />`,
    `    <meta name="apple-mobile-web-app-title" content="${esc(config.locale.appTitle)}" />`,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:title" content="${esc(title)}" />`,
    `    <meta property="og:description" content="${esc(desc)}" />`,
    `    <meta property="og:locale" content="${esc(config.locale.ogLocale)}" />`,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <script type="application/ld+json">`,
    ld,
    `    </script>`,
  ].join('\n')
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      // Inject the SEO head + optional per-brand accent from the business config.
      // Runs in dev and build (no bundle dependency), so the tab title and social
      // tags are correct in both.
      name: 'inject-seo',
      transformIndexHtml(html) {
        // Replacement FUNCTIONS (not strings): a string replacement would treat
        // `$$`, `$&`, `$1`… in the config-derived HTML as special patterns — e.g.
        // priceRange "$$" would collapse to "$", and a "$5" in a tagline would
        // vanish. A function's return value is inserted verbatim.
        const withSeo = html
          .replace(/<html lang="[^"]*">/, () => `<html lang="${esc(config.locale.lang)}">`)
          .replace(
            // Matches the whole block whether the START marker is bare
            // (`<!-- SEO:START -->`) or annotated (`<!-- SEO:START — note -->`).
            /<!-- SEO:START[\s\S]*?<!-- SEO:END -->/,
            () =>
              `<!-- SEO:START — generated from src/config/business.ts by vite.config.ts. -->\n    ${buildSeoBlock()}\n    <!-- SEO:END -->`,
          )

        // A brand accent redefines the berry CSS vars; no accent → nothing injected
        // → the design-system berry stands untouched (identical render).
        const accentCss = accentStyleCss(config.theme?.accent)
        return {
          html: withSeo,
          tags: accentCss ? [{ tag: 'style', children: accentCss, injectTo: 'head' as const }] : [],
        }
      },
    },
    {
      name: 'preload-waffle-scene',
      transformIndexHtml(_html, ctx) {
        const chunk = ctx.bundle
          ? Object.values(ctx.bundle).find(
              (item) => item.type === 'chunk' && item.fileName.includes('WaffleScene'),
            )
          : undefined
        if (!chunk || chunk.type !== 'chunk') return []
        return [
          {
            tag: 'link',
            attrs: { rel: 'modulepreload', href: `/${chunk.fileName}`, crossorigin: '' },
            injectTo: 'head',
          },
        ]
      },
    },
  ],
  build: {
    target: 'es2020',
    // The three.js/R3F/drei chunk lands around 970 kB raw (~267 kB gzip). It's
    // dynamically imported from Hero.tsx, gated behind a capability probe, and
    // fetched on idle — so it never blocks first paint. Ceiling raised past it
    // so a genuine regression in the *initial* chunk still trips the warning.
    chunkSizeWarningLimit: 1100,
  },
  server: {
    port: 5173,
    open: true,
  },
})
