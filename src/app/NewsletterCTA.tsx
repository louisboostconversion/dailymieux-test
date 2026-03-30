"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");

  return (
    <section className="relative overflow-hidden bg-navy py-20 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-blue">
            <Sparkles className="h-3.5 w-3.5" />
            Newsletter hebdomadaire
          </div>

          <h2 className="mb-4 font-[family-name:var(--font-heading)] text-3xl font-bold text-white md:text-4xl">
            Restez inform&eacute;, consommez mieux
          </h2>
          <p className="mx-auto mb-10 max-w-md text-white/50">
            Recevez chaque semaine nos meilleurs conseils pour mieux consommer,
            directement dans votre bo&icirc;te mail.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="Votre adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-blue focus:ring-1 focus:ring-blue"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue/90 active:scale-[0.98]"
            >
              S&apos;inscrire
              <Send className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-4 text-[11px] text-white/25">
            Pas de spam. D&eacute;sinscription en un clic.
          </p>
        </div>
      </div>
    </section>
  );
}
