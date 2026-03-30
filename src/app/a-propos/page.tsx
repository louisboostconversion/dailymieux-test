import { Metadata } from "next";
import { Mail } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos | Daily Mieux",
  description:
    "Découvrez la mission de Daily Mieux : décrypter la consommation d'aujourd'hui avec légèreté et sincérité.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy py-20 md:py-28">
        {/* Decorative blurs */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue/20 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-blue/15 blur-[100px]" />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-light">
            Notre mission
          </span>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight text-white md:text-5xl">
            À propos de Daily Mieux
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/60 md:text-xl">
            Le magazine pour mieux consommer
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20">
        <div className="space-y-10">
          <div>
            <h2 className="mb-4 font-[family-name:var(--font-heading)] text-2xl font-bold text-navy md:text-3xl">
              Pourquoi Daily Mieux ?
            </h2>
            <p className="text-lg leading-relaxed text-text-secondary">
              Chaque jour, nous faisons des choix de consommation sans toujours
              savoir ce qu&apos;ils impliquent. Quel produit choisir&nbsp;? À qui
              faire confiance&nbsp;? Comment consommer mieux sans se ruiner&nbsp;?
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-[family-name:var(--font-heading)] text-2xl font-bold text-navy md:text-3xl">
              Notre conviction
            </h2>
            <p className="text-lg leading-relaxed text-text-secondary">
              Daily Mieux est né d&apos;une conviction simple&nbsp;:{" "}
              <strong className="text-navy">
                mieux consommer, c&apos;est possible quand on a les bonnes clés.
              </strong>{" "}
              Notre mission est d&apos;explorer, comparer et décrypter les produits
              et habitudes du quotidien pour vous apporter des réponses claires,
              utiles et fiables.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-bg-secondary p-8 md:p-10">
            <h2 className="mb-4 font-[family-name:var(--font-heading)] text-2xl font-bold text-navy md:text-3xl">
              Notre approche
            </h2>
            <p className="text-lg leading-relaxed text-text-secondary">
              Pas de culpabilisation, pas de promesses en l&apos;air. Juste des
              contenus pensés pour vous aider à faire des choix éclairés et
              responsables, en accord avec vos valeurs. Daily Mieux décrypte la
              consommation d&apos;aujourd&apos;hui avec légèreté et sincérité.
            </p>
          </div>

          <div className="text-center">
            <p className="text-xl font-medium italic text-navy md:text-2xl">
              &laquo;&nbsp;À force de petits gestes, on peut changer beaucoup de
              choses.&nbsp;&raquo;
            </p>
          </div>

          <div className="flex justify-center pt-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 rounded-xl bg-navy px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-navy/90 active:scale-[0.98]"
            >
              <Mail className="h-4 w-4" />
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
