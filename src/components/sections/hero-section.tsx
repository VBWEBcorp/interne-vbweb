import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { ValuesMarquee } from '@/components/sections/values-marquee'
import { Button } from '@/components/ui/button'

const ease = [0.22, 1, 0.36, 1] as const

const slides = [
  {
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
    alt: 'Espace de travail moderne',
  },
  {
    src: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80',
    alt: 'Équipe en réunion collaborative',
  },
  {
    src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1920&q=80',
    alt: 'Stratégie digitale et innovation',
  },
]

const INTERVAL = 5000

export function HeroSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, INTERVAL)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative isolate overflow-hidden border-b border-border/60">
      {/* Background slideshow */}
      <div className="absolute inset-0" aria-hidden>
        <AnimatePresence initial={false}>
          <motion.img
            key={current}
            src={slides[current].src}
            alt=""
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>

        {/* Dark overlay + gradient for readability */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="font-display text-xs font-semibold tracking-[0.22em] uppercase text-white/70">
            Bienvenue
          </p>
          <h1 className="mt-6 font-display text-balance text-4xl leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
            Votre partenaire pour{' '}
            <span className="text-primary-foreground/90 drop-shadow-sm">
              réussir en ligne
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/75 sm:text-xl">
            Nous accompagnons les entreprises avec des solutions sur mesure,
            pensées pour durer. Présence digitale, performance et clarté.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" className="group" asChild>
              <Link to="/contact">
                Prendre contact
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              asChild
            >
              <Link to="/services">
                <Phone className="size-4" />
                Découvrir nos services
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Slide indicators */}
        <div className="mt-12 flex justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.alt}
              type="button"
              aria-label={`Image ${i + 1} : ${slide.alt}`}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === current
                  ? 'w-8 bg-white'
                  : 'w-4 bg-white/35 hover:bg-white/55'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Values marquee */}
      <div className="relative">
        <ValuesMarquee variant="dark" />
      </div>
    </section>
  )
}
