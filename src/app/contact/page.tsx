"use client";

import { useState } from "react";
import { Mail, Send, MapPin, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = {
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement).value,
      lastName: (form.elements.namedItem("lastName") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erreur");
      setSubmitted(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy py-20 md:py-28">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue/20 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-blue/15 blur-[100px]" />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-light">
            Contact
          </span>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight text-white md:text-5xl">
            Besoin de nous contacter&nbsp;?
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/60 md:text-xl">
            Une question, un partenariat ou simplement envie de discuter&nbsp;?
            Écrivez-nous&nbsp;!
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6 md:py-20">
        {submitted ? (
          <div className="rounded-2xl border border-border bg-bg-secondary p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-pale">
              <Mail className="h-6 w-6 text-blue" />
            </div>
            <h2 className="mb-2 font-[family-name:var(--font-heading)] text-2xl font-bold text-navy">
              Message envoyé&nbsp;!
            </h2>
            <p className="text-text-secondary">
              Merci pour votre message. Nous vous répondrons dans les plus brefs
              délais.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-1.5 block text-sm font-medium text-navy"
                >
                  Prénom
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-sm text-navy transition-colors placeholder:text-text-muted focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-1.5 block text-sm font-medium text-navy"
                >
                  Nom
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-sm text-navy transition-colors placeholder:text-text-muted focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-navy"
              >
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-sm text-navy transition-colors placeholder:text-text-muted focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
                placeholder="votre@email.fr"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-sm font-medium text-navy"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                className="w-full resize-none rounded-xl border border-border bg-bg-secondary px-4 py-3 text-sm text-navy transition-colors placeholder:text-text-muted focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
                placeholder="Votre message..."
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-navy px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-navy/90 active:scale-[0.98] disabled:opacity-50 sm:w-auto"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {loading ? "Envoi..." : "Envoyer le message"}
            </button>
          </form>
        )}

        {/* Contact info */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-pale">
              <Mail className="h-5 w-5 text-blue" />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-navy">Par email</h3>
            <p className="text-sm text-text-secondary">contact@dailymieux.fr</p>
          </div>
          <div className="rounded-2xl border border-border p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-pale">
              <MapPin className="h-5 w-5 text-blue" />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-navy">Localisation</h3>
            <p className="text-sm text-text-secondary">Paris, France</p>
          </div>
        </div>
      </section>
    </>
  );
}
