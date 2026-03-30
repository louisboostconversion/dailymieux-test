"use client";

import Link from "next/link";

const categories = [
  { name: "Régime", slug: "regime" },
  { name: "Consommation", slug: "consommation" },
  { name: "Alimentation", slug: "alimentation" },
  { name: "Santé", slug: "sante" },
  { name: "Maison", slug: "maison" },
  { name: "Beauté", slug: "beaute" },
  { name: "Enfant", slug: "enfant" },
];

const usefulLinks = [
  { name: "À propos", href: "/a-propos" },
  { name: "Contact", href: "/contact" },
  { name: "Mentions légales", href: "/mentions-legales" },
  { name: "Politique de confidentialité", href: "/politique-de-confidentialite" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <span className="font-[family-name:var(--font-heading)] text-xl font-bold">
              Daily Mieux
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              Votre guide quotidien pour mieux consommer. Des conseils, des
              comparatifs et des astuces pour faire les meilleurs choix.
            </p>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Rubriques
            </h3>
            <ul className="space-y-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/${category.slug}`}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful links */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Liens utiles
            </h3>
            <ul className="space-y-2.5">
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Newsletter
            </h3>
            <p className="mb-4 text-sm text-white/50">
              Nos meilleurs conseils chaque semaine, directement dans votre
              boîte mail.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-2.5"
            >
              <input
                type="email"
                placeholder="votre@email.fr"
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 transition-colors focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue/90 active:scale-[0.98]"
              >
                S&apos;inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-white/30">
            &copy; {new Date().getFullYear()} Daily Mieux. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
