import { Link } from 'react-router-dom'

import { SeoHead } from '@/components/seo/seo-head'
import { breadcrumbJsonLd, webPageJsonLd } from '@/components/seo/json-ld'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { siteConfig } from '@/lib/seo'

const description =
  'Politique de confidentialité — découvrez comment nous collectons, utilisons et protégeons vos données personnelles conformément au RGPD.'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webPageJsonLd(
      'Politique de confidentialité',
      description,
      '/politique-de-confidentialite'
    ),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      {
        name: 'Politique de confidentialité',
        path: '/politique-de-confidentialite',
      },
    ]),
  ],
}

export function PrivacyPage() {
  return (
    <>
      <SeoHead
        title="Politique de confidentialité"
        description={description}
        canonical="/politique-de-confidentialite"
        noindex
        jsonLd={jsonLd}
      />

      <Breadcrumb items={[{ label: 'Politique de confidentialité' }]} />

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            Politique de confidentialité
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Dernière mise à jour : [JJ/MM/AAAA]
          </p>

          <article className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground">

            {/* Introduction */}
            <section className="space-y-3">
              <p>
                La société {siteConfig.name} ({'"'}nous{'"'}, {'"'}notre{'"'},{' '}
                {'"'}nos{'"'}) accorde une grande importance à la protection de
                vos données personnelles. La présente politique de
                confidentialité décrit les données que nous collectons, pourquoi
                nous les collectons et comment nous les utilisons, conformément
                au Règlement Général sur la Protection des Données (RGPD —
                Règlement UE 2016/679) et à la loi Informatique et Libertés.
              </p>
            </section>

            {/* 1. Responsable du traitement */}
            <section className="space-y-3">
              <h2>1. Responsable du traitement</h2>
              <p>Le responsable du traitement des données est :</p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>{siteConfig.name}</li>
                <li>
                  {siteConfig.address.street}, {siteConfig.address.postalCode}{' '}
                  {siteConfig.address.city}
                </li>
                <li>Email : {siteConfig.email}</li>
                <li>Téléphone : {siteConfig.phone}</li>
              </ul>
            </section>

            {/* 2. Données collectées */}
            <section className="space-y-3">
              <h2>2. Données personnelles collectées</h2>
              <p>
                Nous collectons uniquement les données strictement nécessaires
                aux finalités décrites ci-dessous :
              </p>

              <h3 className="pt-2">
                a) Données collectées via le formulaire de contact
              </h3>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone (optionnel)</li>
                <li>Contenu du message</li>
              </ul>

              <h3 className="pt-2">
                b) Données collectées automatiquement
              </h3>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>Adresse IP (anonymisée si un outil d'analyse est utilisé)</li>
                <li>Type de navigateur et système d'exploitation</li>
                <li>Pages consultées et durée de visite</li>
                <li>Source de trafic (referrer)</li>
              </ul>
            </section>

            {/* 3. Finalités et base légale */}
            <section className="space-y-3">
              <h2>3. Finalités et base légale du traitement</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border/60">
                      <th className="py-2 pr-4 text-left font-semibold text-foreground">
                        Finalité
                      </th>
                      <th className="py-2 pr-4 text-left font-semibold text-foreground">
                        Base légale
                      </th>
                      <th className="py-2 text-left font-semibold text-foreground">
                        Durée de conservation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="py-2.5 pr-4">Répondre à vos demandes de contact</td>
                      <td className="py-2.5 pr-4">Consentement (art. 6.1.a RGPD)</td>
                      <td className="py-2.5">3 ans après le dernier contact</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4">Établir un devis ou une proposition</td>
                      <td className="py-2.5 pr-4">Mesures précontractuelles (art. 6.1.b)</td>
                      <td className="py-2.5">3 ans après le dernier contact</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4">Analyser la fréquentation du site</td>
                      <td className="py-2.5 pr-4">Intérêt légitime (art. 6.1.f)</td>
                      <td className="py-2.5">25 mois maximum</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4">Assurer la sécurité du site</td>
                      <td className="py-2.5 pr-4">Intérêt légitime (art. 6.1.f)</td>
                      <td className="py-2.5">12 mois</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4. Destinataires */}
            <section className="space-y-3">
              <h2>4. Destinataires des données</h2>
              <p>
                Vos données personnelles ne sont ni vendues, ni louées, ni
                cédées à des tiers à des fins commerciales.
              </p>
              <p>Elles peuvent être transmises uniquement :</p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>
                  À nos sous-traitants techniques (hébergeur, prestataire
                  email), dans le cadre strict de leurs missions et sous
                  contrat de confidentialité
                </li>
                <li>
                  Aux autorités compétentes si la loi l'exige (réquisition
                  judiciaire)
                </li>
              </ul>
            </section>

            {/* 5. Transferts hors UE */}
            <section className="space-y-3">
              <h2>5. Transferts de données hors Union européenne</h2>
              <p>
                Certains de nos sous-traitants peuvent être situés en dehors de
                l'Union européenne. Dans ce cas, le transfert est encadré par
                des garanties appropriées : décision d'adéquation de la
                Commission européenne, clauses contractuelles types ou tout
                autre mécanisme reconnu par le RGPD.
              </p>
            </section>

            {/* 6. Cookies */}
            <section className="space-y-3">
              <h2>6. Cookies</h2>
              <h3 className="pt-2">a) Cookies strictement nécessaires</h3>
              <p>
                Ces cookies sont indispensables au fonctionnement du site
                (préférences de thème, session). Ils ne nécessitent pas votre
                consentement.
              </p>

              <h3 className="pt-2">b) Cookies d'analyse (optionnels)</h3>
              <p>
                [Si applicable] Nous utilisons [Google Analytics / Plausible /
                Matomo / …] pour analyser la fréquentation du site. Ces cookies
                ne sont déposés qu'après votre consentement explicite.
              </p>
              <p>
                Vous pouvez à tout moment modifier vos préférences en matière de
                cookies via le [bandeau de consentement / lien paramètres
                cookies] ou dans les réglages de votre navigateur.
              </p>

              <h3 className="pt-2">c) Cookies tiers</h3>
              <p>
                Aucun cookie publicitaire ou de profilage n'est utilisé sur ce
                site.
              </p>
            </section>

            {/* 7. Vos droits */}
            <section className="space-y-3">
              <h2>7. Vos droits</h2>
              <p>
                Conformément au RGPD et à la loi Informatique et Libertés, vous
                disposez des droits suivants sur vos données personnelles :
              </p>
              <ul className="list-inside list-disc space-y-1 pl-1">
                <li>
                  <strong>Droit d'accès</strong> — obtenir la confirmation du
                  traitement de vos données et en recevoir une copie
                </li>
                <li>
                  <strong>Droit de rectification</strong> — corriger des données
                  inexactes ou incomplètes
                </li>
                <li>
                  <strong>Droit à l'effacement</strong> — demander la
                  suppression de vos données (dans les limites légales)
                </li>
                <li>
                  <strong>Droit à la limitation</strong> — restreindre
                  temporairement le traitement de vos données
                </li>
                <li>
                  <strong>Droit à la portabilité</strong> — recevoir vos données
                  dans un format structuré et lisible
                </li>
                <li>
                  <strong>Droit d'opposition</strong> — vous opposer au
                  traitement de vos données pour des motifs légitimes
                </li>
                <li>
                  <strong>Droit de retirer votre consentement</strong> — à tout
                  moment, sans affecter la licéité du traitement antérieur
                </li>
              </ul>
              <p>
                Pour exercer vos droits, contactez-nous par email à{' '}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  {siteConfig.email}
                </a>{' '}
                ou par courrier à l'adresse indiquée ci-dessus. Nous répondons
                dans un délai maximum de 30 jours.
              </p>
              <p>
                Si vous estimez que le traitement de vos données constitue une
                violation de vos droits, vous pouvez introduire une réclamation
                auprès de la{' '}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  CNIL
                </a>{' '}
                (Commission Nationale de l'Informatique et des Libertés).
              </p>
            </section>

            {/* 8. Sécurité */}
            <section className="space-y-3">
              <h2>8. Sécurité des données</h2>
              <p>
                Nous mettons en œuvre des mesures techniques et
                organisationnelles appropriées pour protéger vos données contre
                tout accès non autorisé, perte, altération ou divulgation :
                chiffrement SSL/TLS, accès restreints, sauvegardes régulières,
                mises à jour de sécurité.
              </p>
            </section>

            {/* 9. Mineurs */}
            <section className="space-y-3">
              <h2>9. Données des mineurs</h2>
              <p>
                Ce site ne s'adresse pas aux mineurs de moins de 16 ans. Nous ne
                collectons pas sciemment de données personnelles relatives aux
                mineurs. Si nous découvrons qu'un mineur nous a transmis des
                données personnelles, nous les supprimerons dans les meilleurs
                délais.
              </p>
            </section>

            {/* 10. Modifications */}
            <section className="space-y-3">
              <h2>10. Modification de la politique</h2>
              <p>
                Nous nous réservons le droit de modifier la présente politique de
                confidentialité à tout moment. La version en vigueur est celle
                accessible sur cette page, identifiée par sa date de dernière
                mise à jour. Nous vous encourageons à la consulter
                régulièrement.
              </p>
            </section>

            {/* Lien vers mentions légales */}
            <section className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-5">
              <p className="text-foreground">
                Consultez également nos{' '}
                <Link
                  to="/mentions-legales"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Mentions légales
                </Link>{' '}
                pour les informations relatives à l'éditeur et à l'hébergement
                du site.
              </p>
            </section>
          </article>
        </div>
      </section>
    </>
  )
}
