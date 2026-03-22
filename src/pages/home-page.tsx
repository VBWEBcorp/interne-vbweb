import {
  localBusinessJsonLd,
  organizationJsonLd,
  webPageJsonLd,
  webSiteJsonLd,
} from '@/components/seo/json-ld'
import { SeoHead } from '@/components/seo/seo-head'
import { CtaSection } from '@/components/sections/cta-section'
import { GalleryCarousel } from '@/components/sections/gallery-carousel'
import { HeroSection } from '@/components/sections/hero-section'
import { ServicesPreview } from '@/components/sections/services-preview'
import { StorySection } from '@/components/sections/story-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { ValuesMarquee } from '@/components/sections/values-marquee'
import { siteConfig } from '@/lib/seo'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webSiteJsonLd(),
    organizationJsonLd(),
    localBusinessJsonLd(),
    webPageJsonLd(siteConfig.name, siteConfig.description, '/'),
  ],
}

export function HomePage() {
  return (
    <>
      <SeoHead
        description={siteConfig.description}
        canonical="/"
        jsonLd={jsonLd}
      />
      <HeroSection />
      <ServicesPreview />
      <StorySection />
      <TestimonialsSection />
      <GalleryCarousel />
      <CtaSection />
      <ValuesMarquee />
    </>
  )
}
