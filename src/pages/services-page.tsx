import { motion } from 'framer-motion'
import {
  BarChart3,
  Code,
  Globe,
  Megaphone,
  Palette,
  Search,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'

import { SeoHead } from '@/components/seo/seo-head'
import {
  breadcrumbJsonLd,
  serviceJsonLd,
  webPageJsonLd,
} from '@/components/seo/json-ld'
import { CtaSection } from '@/components/sections/cta-section'
import { PageHero } from '@/components/sections/page-hero'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const ease = [0.22, 1, 0.36, 1] as const

const services = [
  {
    icon: Globe,
    title: 'Création de site vitrine',
    desc: 'Un site moderne, rapide et responsive qui présente clairement votre activité et inspire confiance à vos visiteurs.',
  },
  {
    icon: Smartphone,
    title: 'Application web',
    desc: 'Outils métier, plateformes de réservation, espaces clients — des applications pensées pour simplifier votre quotidien.',
  },
  {
    icon: Search,
    title: 'Référencement naturel (SEO)',
    desc: 'Optimisation technique, contenu stratégique et suivi de positionnement pour gagner en visibilité sur Google.',
  },
  {
    icon: Palette,
    title: 'Identité visuelle',
    desc: 'Logo, charte graphique, supports de communication : une image cohérente qui vous ressemble.',
  },
  {
    icon: Megaphone,
    title: 'Communication digitale',
    desc: 'Stratégie de contenu, réseaux sociaux et campagnes pour développer votre audience en ligne.',
  },
  {
    icon: Code,
    title: 'Développement sur mesure',
    desc: 'Intégrations, automatisations, API — des solutions techniques taillées pour vos besoins spécifiques.',
  },
  {
    icon: ShieldCheck,
    title: 'Maintenance & sécurité',
    desc: 'Mises à jour, sauvegardes, monitoring et corrections pour un site toujours performant et sécurisé.',
  },
  {
    icon: BarChart3,
    title: 'Analyse & reporting',
    desc: 'Tableaux de bord clairs pour suivre vos performances, comprendre vos visiteurs et ajuster votre stratégie.',
  },
] as const

const description =
  'Création de site, SEO, identité visuelle, développement sur mesure — découvrez nos services pour développer votre activité en ligne.'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webPageJsonLd('Services', description, '/services'),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Services', path: '/services' },
    ]),
    ...services.map((s) => serviceJsonLd(s.title, s.desc, '/services')),
  ],
}

export function ServicesPage() {
  return (
    <>
      <SeoHead
        title="Services"
        description={description}
        canonical="/services"
        jsonLd={jsonLd}
      />

      <PageHero
        eyebrow="Services"
        title="Tout ce qu'il faut pour réussir en ligne"
        description="Des prestations complètes, de la conception à l'accompagnement continu, adaptées à toutes les tailles d'entreprise."
        image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80"
        breadcrumb="Services"
      />

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, ease, delay: i * 0.03 }}
              >
                <Card className="h-full rounded-2xl border-border/80 bg-card/70 shadow-[var(--shadow-sm)] ring-1 ring-foreground/5 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
                  <CardHeader>
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                      <s.icon className="size-5" aria-hidden />
                    </span>
                    <CardTitle className="font-display text-base">
                      {s.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {s.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  )
}
