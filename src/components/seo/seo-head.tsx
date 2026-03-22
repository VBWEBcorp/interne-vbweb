import { Helmet } from 'react-helmet-async'

import { buildTitle, siteConfig, type SeoMeta } from '@/lib/seo'

type SeoHeadProps = SeoMeta

export function SeoHead({
  title,
  description = siteConfig.description,
  canonical,
  ogImage = siteConfig.ogImage,
  ogType = 'website',
  noindex = false,
  jsonLd,
}: SeoHeadProps) {
  const fullTitle = buildTitle(title)
  const canonicalUrl = canonical
    ? `${siteConfig.url}${canonical}`
    : undefined

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {noindex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      )}

      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={siteConfig.locale} />
      {canonicalUrl ? (
        <meta property="og:url" content={canonicalUrl} />
      ) : null}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteConfig.twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {jsonLd ? (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      ) : null}
    </Helmet>
  )
}
