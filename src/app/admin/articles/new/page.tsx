"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { articleTypeLabels } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewArticle() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    type: "guide",
    categoryId: "",
    coverImage: "",
    status: "draft",
    featured: false,
    sponsorName: "",
    sponsorUrl: "",
    ctaLabel: "",
    ctaUrl: "",
    seoTitle: "",
    seoDesc: "",
    content: "",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  function updateForm(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(status?: string) {
    setError("");
    setSaving(true);

    try {
      // Get authorId from auth
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();

      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: status || form.status,
          authorId: meData.user.id,
          content: form.content || JSON.stringify(getDefaultContent(form.type)),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de la sauvegarde");
        return;
      }

      const article = await res.json();
      router.push(`/admin/articles/${article.id}/edit`);
    } catch {
      setError("Erreur de connexion");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Nouvel article</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Brouillon
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#2D5A3D] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#234a31] disabled:opacity-50"
          >
            <Eye className="h-4 w-4" />
            Publier
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Titre
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-medium focus:border-[#2D5A3D] focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/20"
                  placeholder="Le titre de votre article..."
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Extrait
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => updateForm("excerpt", e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#2D5A3D] focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/20"
                  placeholder="Un résumé accrocheur de l'article..."
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Contenu (JSON)
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => updateForm("content", e.target.value)}
                  rows={15}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm focus:border-[#2D5A3D] focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/20"
                  placeholder={`Collez le contenu JSON structuré ici...\n\nExemple pour un guide :\n${JSON.stringify(getDefaultContent("guide"), null, 2)}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">Paramètres</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => updateForm("type", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none"
                >
                  {Object.entries(articleTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Catégorie
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) => updateForm("categoryId", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none"
                >
                  <option value="">Sélectionner...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Image de couverture (URL)
                </label>
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(e) => updateForm("coverImage", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => updateForm("featured", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#2D5A3D] focus:ring-[#2D5A3D]"
                />
                <label htmlFor="featured" className="text-sm text-gray-700">
                  Article à la une
                </label>
              </div>
            </div>
          </div>

          {/* Sponsor section */}
          {(form.type === "advertorial" || form.type === "review") && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">Sponsor</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Nom du sponsor
                  </label>
                  <input
                    type="text"
                    value={form.sponsorName}
                    onChange={(e) => updateForm("sponsorName", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    URL sponsor
                  </label>
                  <input
                    type="text"
                    value={form.sponsorUrl}
                    onChange={(e) => updateForm("sponsorUrl", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Label CTA
                  </label>
                  <input
                    type="text"
                    value={form.ctaLabel}
                    onChange={(e) => updateForm("ctaLabel", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none"
                    placeholder="Découvrir maintenant"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    URL CTA
                  </label>
                  <input
                    type="text"
                    value={form.ctaUrl}
                    onChange={(e) => updateForm("ctaUrl", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SEO */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Titre SEO
                </label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => updateForm("seoTitle", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none"
                  placeholder={form.title || "Titre pour les moteurs de recherche"}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description SEO
                </label>
                <textarea
                  value={form.seoDesc}
                  onChange={(e) => updateForm("seoDesc", e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none"
                  placeholder={form.excerpt || "Description pour les moteurs de recherche"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getDefaultContent(type: string) {
  switch (type) {
    case "advertorial":
      return {
        sections: [{ title: "Section 1", body: "Contenu de la section..." }],
        products: [{ name: "Produit", description: "Description", price: "29,99€", ctaLabel: "Découvrir", ctaUrl: "#" }],
        verdict: "Notre verdict...",
      };
    case "comparative":
      return {
        criteria: ["Qualité", "Prix", "Design"],
        products: [
          { name: "Produit A", ratings: { "Qualité": 4, "Prix": 3, "Design": 5 }, pros: ["Avantage 1"], cons: ["Inconvénient 1"] },
          { name: "Produit B", ratings: { "Qualité": 3, "Prix": 5, "Design": 3 }, pros: ["Avantage 1"], cons: ["Inconvénient 1"] },
        ],
        winner: "Produit A",
        verdict: "Notre verdict...",
      };
    case "listicle":
      return {
        items: [{ title: "Item 1", body: "Description de l'item..." }],
      };
    case "review":
      return {
        overallScore: 8,
        criteria: [{ name: "Qualité", score: 8 }],
        pros: ["Avantage 1"],
        cons: ["Inconvénient 1"],
        forWho: "Ce produit convient à...",
        alternatives: [{ name: "Alternative 1" }],
        body: "Contenu de la review...",
      };
    case "guide":
    default:
      return {
        sections: [{ id: "section-1", title: "Section 1", body: "Contenu..." }],
        tips: [{ title: "Conseil", body: "Un conseil utile..." }],
        faq: [{ question: "Question ?", answer: "Réponse." }],
      };
  }
}
