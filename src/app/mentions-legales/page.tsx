import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales | Daily Mieux",
  description: "Mentions légales du site Daily Mieux.",
};

export default function MentionsLegalesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white md:text-4xl">
            Mentions légales
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20">
        <div className="space-y-10 text-text-secondary">
          <div>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-xl font-bold text-navy">
              1. Éditeur du site
            </h2>
            <p className="leading-relaxed">
              Le site <strong className="text-navy">dailymieux.fr</strong> est édité par
              Daily Mieux, société enregistrée en France.
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1 pl-1">
              <li>Directeur de la publication : Daily Mieux</li>
              <li>
                Adresse e-mail :{" "}
                <a href="mailto:contact@dailymieux.fr" className="text-blue hover:underline">
                  contact@dailymieux.fr
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-xl font-bold text-navy">
              2. Hébergement
            </h2>
            <p className="leading-relaxed">
              Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133,
              Covina, CA 91723, États-Unis.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-xl font-bold text-navy">
              3. Propriété intellectuelle
            </h2>
            <p className="leading-relaxed">
              L&apos;ensemble du contenu du site (textes, images, graphismes, logo,
              icônes, etc.) est protégé par le droit d&apos;auteur et la propriété
              intellectuelle. Toute reproduction, distribution, modification ou
              utilisation de ces contenus sans autorisation préalable est
              strictement interdite.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-xl font-bold text-navy">
              4. Contenus sponsorisés
            </h2>
            <p className="leading-relaxed">
              Certains articles publiés sur Daily Mieux peuvent contenir des
              recommandations de produits ou services. Daily Mieux peut percevoir
              une rémunération de la part des marques partenaires. Cela n&apos;affecte
              pas l&apos;indépendance de nos contenus éditoriaux.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-xl font-bold text-navy">
              5. Liens hypertextes
            </h2>
            <p className="leading-relaxed">
              Le site peut contenir des liens vers d&apos;autres sites internet.
              Daily Mieux ne saurait être tenu responsable du contenu de ces
              sites externes.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-xl font-bold text-navy">
              6. Responsabilité
            </h2>
            <p className="leading-relaxed">
              Les informations fournies sur le site sont à titre indicatif et ne
              sauraient constituer un conseil médical, juridique ou financier.
              Daily Mieux décline toute responsabilité quant à l&apos;utilisation
              qui pourrait être faite des informations publiées.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
