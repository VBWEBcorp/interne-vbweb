import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'

import { Logo } from '@/components/layout/logo'
import { Separator } from '@/components/ui/separator'
import { siteConfig } from '@/lib/seo'

const navCols = [
  {
    title: 'Navigation',
    links: [
      { label: 'Accueil', to: '/' },
      { label: 'À propos', to: '/a-propos' },
      { label: 'Services', to: '/services' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { label: 'Mentions légales', to: '/mentions-legales' },
      { label: 'Politique de confidentialité', to: '/politique-de-confidentialite' },
    ],
  },
] as const

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-muted/25">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" aria-hidden />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-foreground">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" aria-hidden />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-foreground">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span>
                  {siteConfig.address.street}, {siteConfig.address.postalCode}{' '}
                  {siteConfig.address.city}
                </span>
              </li>
            </ul>
          </div>
          {navCols.map((col) => (
            <nav key={col.title} aria-label={col.title} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <Separator className="my-10 bg-border/80" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <Link
              to="/mentions-legales"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Mentions légales
            </Link>
            <Link
              to="/politique-de-confidentialite"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
