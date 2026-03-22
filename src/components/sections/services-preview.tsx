import { motion } from 'framer-motion'
import { ArrowRight, Globe, Palette, Search, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SectionTitle } from '@/components/ui/section-title'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const services = [
  {
    icon: Globe,
    title: 'Création de site web',
    desc: 'Sites vitrines modernes, responsive et optimisés pour convertir vos visiteurs en clients.',
  },
  {
    icon: Search,
    title: 'Référencement SEO',
    desc: 'Stratégie de contenu et optimisation technique pour apparaître en première page Google.',
  },
  {
    icon: Palette,
    title: 'Identité visuelle',
    desc: 'Logo, charte graphique et supports cohérents qui reflètent votre image de marque.',
  },
  {
    icon: ShieldCheck,
    title: 'Maintenance & support',
    desc: 'Mises à jour, sécurité et accompagnement continu pour garder votre site performant.',
  },
] as const

const ease = [0.22, 1, 0.36, 1] as const

export function ServicesPreview() {
  return (
    <section className="border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionTitle
          eyebrow="Nos services"
          title="Des solutions adaptées à votre activité"
          description="Quel que soit votre secteur, nous vous aidons à développer votre présence et à atteindre vos objectifs."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45, ease, delay: i * 0.04 }}
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
        <div className="mt-10 text-center">
          <Button variant="outline" className="group" asChild>
            <Link to="/services">
              Voir tous nos services
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
