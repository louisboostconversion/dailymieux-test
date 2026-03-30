"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, Eye, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { articleTypeLabels } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

export default function EditArticle() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
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
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch(`/api/articles/${id}`).then((r) => r.json()),
    ]).then(([cats, article]) => {
      setCategories(cats);
      setForm({
        title: article.title || "",
        excerpt: article.excerpt || "",
        type: article.type || "guide",
        categoryId: article.categoryId || "",
        coverImage: article.coverImage || "",
        status: article.status || "draft",
        featured: article.featured || false,
        sponsorName: article.sponsorName || "",
        sponsorUrl: article.sponsorUrl || "",
        ctaLabel: article.ctaLabel || "",
        ctaUrl: article.ctaUrl || "",
        seoTitle: article.seoTitle || "",
        seoDesc: article.seoDesc || "",
        content: typeof article.content === "string"
          ? article.content
          : JSON.stringify(article.content, null, 2),
      });
      setLoading(false);
    });
  }, [id]);

  function updateForm(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(status?: string) {
    setError("");
    setSaving(true);

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: status || form.status,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de la sauvegarde");
        return;
      }

      router.refresh();
    } catch {
      setError("Erreur de connexion");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Supprimer cet article ?")) return;
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    router.push("/admin/articles");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2D5A3D] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/articles" className="rounded-lg p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Éditer l&apos;article</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Sauvegarder
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#2D5A3D] px-4 py-2 text-sm font-medium text-white hover:bg-[#234a31] disabled:opacity-50"
          >
            <Eye className="h-4 w-4" />
            Publier
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Titre</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-medium focus:border-[#2D5A3D] focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Extrait</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => updateForm("excerpt", e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#2D5A3D] focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Contenu (JSON)</label>
                <textarea
                  value={form.content}
                  onChange={(e) => updateForm("content", e.target.value)}
                  rows={20}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm focus:border-[#2D5A3D] focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/20"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">Paramètres</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => updateForm("type", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none"
                >
                  {Object.entries(articleTypeLabels).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Catégorie</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => updateForm("categoryId", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none"
                >
                  <option value="">Sélectionner...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Image de couverture</label>
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
                  className="h-4 w-4 rounded border-gray-300 text-[#2D5A3D]"
                />
                <label htmlFor="featured" className="text-sm text-gray-700">Article à la une</label>
              </div>
            </div>
          </div>

          {(form.type === "advertorial" || form.type === "review") && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">Sponsor</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Nom</label>
                  <input type="text" value={form.sponsorName} onChange={(e) => updateForm("sponsorName", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">URL</label>
                  <input type="text" value={form.sponsorUrl} onChange={(e) => updateForm("sponsorUrl", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">CTA Label</label>
                  <input type="text" value={form.ctaLabel} onChange={(e) => updateForm("ctaLabel", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">CTA URL</label>
                  <input type="text" value={form.ctaUrl} onChange={(e) => updateForm("ctaUrl", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Titre SEO</label>
                <input type="text" value={form.seoTitle} onChange={(e) => updateForm("seoTitle", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none" placeholder={form.title} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Description SEO</label>
                <textarea value={form.seoDesc} onChange={(e) => updateForm("seoDesc", e.target.value)} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none" placeholder={form.excerpt} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
