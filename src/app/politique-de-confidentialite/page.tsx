import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Daily Mieux",
  description: "Politique de confidentialité du site Daily Mieux.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white md:text-4xl">
            Politique de confidentialité
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20">
        <div className="space-y-10 text-text-secondary">
          <p className="text-lg leading-relaxed">
            Chez Daily Mieux, nous attachons une grande importance à la protection
            de vos données personnelles. Cette politique décrit comment nous
            collectons, utilisons et protégeons vos informations.
          </p>

          <div>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-xl font-bold text-navy">
              1. Données collectées
            </h2>
            <p className="leading-relaxed">
              Nous pouvons collecter les données suivantes lorsque vous utilisez
              notre site :
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1 pl-1">
              <li>Adresse e-mail (inscription newsletter, formulaire de contact)</li>
              <li>Prénom et nom (formulaire de contact)</li>
              <li>
                Données de navigation (pages visitées, durée de visite) via des
                cookies analytiques
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-xl font-bold text-navy">
              2. Utilisation des données
            </h2>
            <p className="leading-relaxed">Vos données sont utilisées pour :</p>
            <ul className="mt-3 list-inside list-disc space-y-1 pl-1">
              <li>Vous envoyer notre newsletter (avec votre consentement)</li>
              <li>Répondre à vos demandes via le formulaire de contact</li>
              <li>Améliorer notre site et son contenu</li>
              <li>Produire des statistiques anonymes de fréquentation</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-xl font-bold text-navy">
              3. Cookies
            </h2>
            <p className="leading-relaxed">
              Le site utilise des cookies pour améliorer votre expérience de
              navigation et mesurer l&apos;audience du site. Vous pouvez à tout moment
              désactiver les cookies dans les paramètres de votre navigateur.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-xl font-bold text-navy">
              4. Partage des données
            </h2>
            <p className="leading-relaxed">
              Vos données personnelles ne sont jamais vendues à des tiers. Elles
              peuvent être partagées avec nos sous-traitants techniques
              (hébergement, envoi d&apos;e-mails) dans le strict cadre de la
              fourniture du service.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-xl font-bold text-navy">
              5. Conservation des données
            </h2>
            <p className="leading-relaxed">
              Vos données sont conservées pour la durée nécessaire à la
              réalisation des finalités décrites ci-dessus, et conformément à la
              réglementation en vigueur (RGPD).
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-xl font-bold text-navy">
              6. Vos droits
            </h2>
            <p className="leading-relaxed">
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
              rectification, de suppression et de portabilité de vos données.
              Pour exercer ces droits, contactez-nous à{" "}
              <a
                href="mailto:contact@dailymieux.fr"
                className="text-blue hover:underline"
              >
                contact@dailymieux.fr
              </a>
              .
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-bg-secondary p-6">
            <p className="text-sm leading-relaxed">
              <strong className="text-navy">Dernière mise à jour :</strong> mars 2026.
              Cette politique peut être modifiée à tout moment. Nous vous
              invitons à la consulter régulièrement.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
