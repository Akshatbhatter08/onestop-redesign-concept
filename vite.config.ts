import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
