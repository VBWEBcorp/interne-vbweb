import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SITE_URL = process.env.SITE_URL ?? 'https://www.example.com'

const routes: { path: string; priority: string; changefreq: string }[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/a-propos', priority: '0.8', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
]

function buildSitemap() {
  const today = new Date().toISOString().split('T')[0]

  const urls = routes
    .map(
      (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

  const outDir = path.resolve(__dirname, '..', 'dist')
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf-8')

  const publicDir = path.resolve(__dirname, '..', 'public')
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf-8')

  console.log('[sitemap] Generated sitemap.xml with', routes.length, 'routes')
}

buildSitemap()
