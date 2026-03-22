import { Link } from 'react-router-dom'

import { SeoHead } from '@/components/seo/seo-head'
import { breadcrumbJsonLd, webPageJsonLd } from '@/components/seo/json-ld'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { siteConfig } from '@/lib/seo'

const description =
  'Mentions légales du site — informations sur l\'éditeur, l\'hébergement, la propriété intellectuelle et les conditions d\'utilisation.'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webPageJsonLd('Mentions légales', description, '/mentions-legales'),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Mentions légales', path: '/mentions-legales' },
    ]),
  ],
}

export function LegalPage() {
  return (
    <>
      <SeoHead
        title="Mentions légales"
        description={description}
        canonical="/mentions-legales"
        noindex
        jsonLd={jsonLd}
      />

      <Breadcrumb items={[{ label: 'Mentions légales' }]} />

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            Mentions légales
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Dernière mise à jour : [JJ/MM/AAAA]
          </p>

          <article className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground">

            {/* 1. Éditeur */}
            <section className="space-y-3">
              <h2>1. Éditeur du site</h2>
              <p>
                Le site <strong>{siteConfig.url}</strong> est édité par :
              </p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>Raison sociale : {siteConfig.name}</li>
                <li>Forme juridique : [SARL / SAS / Auto-entrepreneur / …]</li>
                <li>Capital social : [À compléter] €</li>
                <li>SIRET : [À compléter]</li>
                <li>RCS : [Ville] [N°]</li>
                <li>TVA intracommunautaire : [À compléter]</li>
                <li>
                  Siège social : {siteConfig.address.street},{' '}
                  {siteConfig.address.postalCode} {siteConfig.address.city}
                </li>
                <li>Téléphone : {siteConfig.phone}</li>
                <li>Email : {siteConfig.email}</li>
              </ul>
              <p>
                Directeur de la publication : [Nom et prénom du responsable]
              </p>
            </section>

            {/* 2. Hébergement */}
            <section className="space-y-3">
              <h2>2. Hébergement</h2>
              <p>Le site est hébergé par :</p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>Raison sociale : [Nom de l'hébergeur — ex: Netlify, OVH, Vercel]</li>
                <li>Adresse : [Adresse de l'hébergeur]</li>
                <li>Téléphone : [Téléphone de l'hébergeur]</li>
                <li>Site web : [URL de l'hébergeur]</li>
              </ul>
            </section>

            {/* 3. Propriété intellectuelle */}
            <section className="space-y-3">
              <h2>3. Propriété intellectuelle</h2>
              <p>
                L'ensemble des contenus présents sur le site (textes,
                photographies, illustrations, logos, icônes, éléments
                graphiques, vidéos, bases de données, code source) est protégé
                par les lois françaises et internationales relatives à la
                propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication,
                adaptation, totale ou partielle, de ces éléments, quel que soit
                le moyen ou le procédé utilisé, est interdite sauf autorisation
                écrite préalable de {siteConfig.name}.
              </p>
              <p>
                Toute exploitation non autorisée du site ou de son contenu sera
                considérée comme constitutive d'une contrefaçon et poursuivie
                conformément aux articles L.335-2 et suivants du Code de la
                propriété intellectuelle.
              </p>
            </section>

            {/* 4. Limitation de responsabilité */}
            <section className="space-y-3">
              <h2>4. Limitation de responsabilité</h2>
              <p>
                {siteConfig.name} s'efforce de fournir des informations aussi
                précises que possible sur le site. Toutefois, il ne pourra être
                tenu responsable des omissions, des inexactitudes ou des
                carences dans la mise à jour, qu'elles soient de son fait ou du
                fait des tiers partenaires qui lui fournissent ces informations.
              </p>
              <p>
                {siteConfig.name} ne pourra être tenu responsable des dommages
                directs et indirects causés au matériel de l'utilisateur lors de
                l'accès au site, résultant soit de l'utilisation d'un matériel
                ne répondant pas aux spécifications techniques requises, soit de
                l'apparition d'un bug ou d'une incompatibilité.
              </p>
            </section>

            {/* 5. Liens hypertextes */}
            <section className="space-y-3">
              <h2>5. Liens hypertextes</h2>
              <p>
                Le site peut contenir des liens hypertextes vers d'autres sites.
                Cependant, {siteConfig.name} n'a pas la possibilité de vérifier
                le contenu des sites ainsi visités et n'assumera en conséquence
                aucune responsabilité de ce fait.
              </p>
              <p>
                La mise en place de liens hypertextes vers le site nécessite une
                autorisation préalable et écrite de {siteConfig.name}.
              </p>
            </section>

            {/* 6. Droit applicable */}
            <section className="space-y-3">
              <h2>6. Droit applicable et juridiction compétente</h2>
              <p>
                Les présentes mentions légales sont régies par le droit
                français. En cas de litige, et après l'échec de toute tentative
                de recherche d'une solution amiable, les tribunaux français
                seront seuls compétents pour connaître de ce litige.
              </p>
            </section>

            {/* 7. Crédits */}
            <section className="space-y-3">
              <h2>7. Crédits</h2>
              <p>Conception et développement : [À compléter]</p>
              <p>Crédits photos : [À compléter]</p>
            </section>

            {/* Lien vers politique de confidentialité */}
            <section className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-5">
              <p className="text-foreground">
                Pour connaître nos pratiques en matière de collecte et de
                traitement des données personnelles, consultez notre{' '}
                <Link
                  to="/politique-de-confidentialite"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Politique de confidentialité
                </Link>
                .
              </p>
            </section>
          </article>
        </div>
      </section>
    </>
  )
}
