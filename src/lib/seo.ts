export const siteConfig = {
  name: 'VBWEB',
  url: 'https://www.vbweb.fr',
  locale: 'fr_FR',
  description:
    'Espace interne VBWEB — gestion des contrats, clients et prestations.',
  ogImage: 'https://www.vbweb.fr/og.png',
  twitterHandle: '@vbweb',
  themeColor: '#6d28d9',
  phone: '+33 6 00 00 00 00',
  email: 'contact@vbweb.fr',
  address: {
    street: 'Rennes',
    city: 'Rennes',
    postalCode: '35000',
    country: 'FR',
  },
} as const

export type SeoMeta = {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  noindex?: boolean
  jsonLd?: Record<string, unknown>
}

export function buildTitle(page?: string) {
  if (!page) return siteConfig.name
  return `${page} — ${siteConfig.name}`
}

export const routes = [
  '/',
  '/a-propos',
  '/services',
  '/contact',
  '/mentions-legales',
  '/politique-de-confidentialite',
] as const
