import path from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import seoPrerender from 'vite-plugin-seo-prerender'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isCI = Boolean(process.env.CI || process.env.NETLIFY)

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    !isCI && seoPrerender({
      routes: ['/', '/a-propos', '/services', '/contact', '/mentions-legales', '/politique-de-confidentialite'],
      removeStyle: false,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5175,
    proxy: {
      '/api': {
        target: 'http://localhost:5174',
        changeOrigin: true,
      },
    },
  },
})
