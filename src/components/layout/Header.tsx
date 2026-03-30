"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const categories = [
  { name: "Régime", slug: "regime" },
  { name: "Consommation", slug: "consommation" },
  { name: "Alimentation", slug: "alimentation" },
  { name: "Santé", slug: "sante" },
  { name: "Maison", slug: "maison" },
  { name: "Beauté", slug: "beaute" },
  { name: "Enfant", slug: "enfant" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 shadow-[0_1px_3px_rgba(11,25,86,0.08)] backdrop-blur-md"
          : "bg-white"
      }`}
    >
      {/* Top accent line */}
      <div className="h-[3px] bg-gradient-to-r from-navy via-blue to-navy" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-[72px]">
          {/* Logo */}
          <Link href="/" className="group flex flex-col">
            <span className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight text-navy transition-colors group-hover:text-blue md:text-[22px]">
              Daily Mieux
            </span>
            <span className="-mt-0.5 hidden text-[10px] font-medium uppercase tracking-[0.15em] text-text-muted md:block">
              Mieux consommer au quotidien
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className="relative rounded-md px-3 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:text-navy after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-blue after:transition-all hover:after:w-2/3"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2">
            <button
              className="hidden rounded-full p-2 text-text-secondary transition-colors hover:bg-blue-light hover:text-navy lg:flex"
              aria-label="Rechercher"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="rounded-lg p-2 text-navy transition-colors hover:bg-blue-light lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-navy/30 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-2xl"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-border px-6 py-5">
                  <span className="font-[family-name:var(--font-heading)] text-lg font-bold text-navy">
                    Daily Mieux
                  </span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-blue-light"
                    aria-label="Fermer le menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-6">
                  <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                    Rubriques
                  </p>
                  {categories.map((category, i) => (
                    <motion.div
                      key={category.slug}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.04 }}
                    >
                      <Link
                        href={`/${category.slug}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between rounded-xl px-3 py-3.5 text-navy transition-colors hover:bg-blue-pale"
                      >
                        <span className="text-sm font-medium">{category.name}</span>
                        <ChevronRight className="h-4 w-4 text-text-muted" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
