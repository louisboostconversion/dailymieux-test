"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, Eye, ArrowLeft, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { articleTypeLabels } from "@/lib/utils";
import ContentEditorSwitch from "@/components/admin/editors/ContentEditorSwitch";
import ArticlePreview from "@/components/admin/editors/ArticlePreview";
import Toast from "@/components/admin/Toast";

interface Category {
  id: string;
  name: string;
}

interface AuthorOption {
  id: string;
  name: string;
  avatar: string | null;
}

export default function EditArticle() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<AuthorOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    type: "guide",
    topic: "lifestyle",
    categoryId: "",
    coverImage: "",
    status: "draft",
    featured: false,
    // Affiliation & Liens
    affiliateUrl: "",
    ctaLabel: "",
    ctaUrl: "",
    outUtmSource: "",
    outUtmMedium: "",
    outUtmCampaign: "",
    // Monetisation
    productPrice: "",
    commissionRate: "",
    // Tracking & Pixels
    metaPixelId: "",
    metaEvent: "ViewContent",
    tiktokPixelId: "",
    tiktokEvent: "ViewContent",
    gaId: "",
    // Campagne & Sponsor
    campaignTags: "",
    sponsorName: "",
    sponsorUrl: "",
    // SEO
    seoTitle: "",
    seoDesc: "",
    content: "",
    authorId: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch(`/api/articles/${id}`).then((r) => r.json()),
      fetch("/api/authors").then((r) => r.json()).catch(() => []),
    ]).then(([cats, article, authorsList]) => {
      setCategories(cats);
      setAuthors(authorsList);
      setForm({
        title: article.title || "",
        excerpt: article.excerpt || "",
        type: article.type || "guide",
        topic: article.topic || "lifestyle",
        categoryId: article.categoryId || "",
        coverImage: article.coverImage || "",
        status: article.status || "draft",
        featured: article.featured || false,
        affiliateUrl: article.affiliateUrl || "",
        ctaLabel: article.ctaLabel || "",
        ctaUrl: article.ctaUrl || "",
        outUtmSource: article.outUtmSource || "",
        outUtmMedium: article.outUtmMedium || "",
        outUtmCampaign: article.outUtmCampaign || "",
        productPrice: article.productPrice != null ? String(article.productPrice) : "",
        commissionRate: article.commissionRate != null ? String(article.commissionRate) : "",
        metaPixelId: article.metaPixelId || "",
        metaEvent: article.metaEvent || "ViewContent",
        tiktokPixelId: article.tiktokPixelId || "",
        tiktokEvent: article.tiktokEvent || "ViewContent",
        gaId: article.gaId || "",
        campaignTags: article.campaignTags || "",
        sponsorName: article.sponsorName || "",
        sponsorUrl: article.sponsorUrl || "",
        seoTitle: article.seoTitle || "",
        seoDesc: article.seoDesc || "",
        authorId: article.authorId || "",
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
        setToast({ message: data.error || "Erreur lors de la sauvegarde", type: "error" });
        return;
      }

      const label = status === "published" ? "Article publié avec succès !" : "Article sauvegardé !";
      setToast({ message: label, type: "success" });
      router.refresh();
    } catch {
      setError("Erreur de connexion");
      setToast({ message: "Erreur de connexion", type: "error" });
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
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          visible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
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

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => setTab("edit")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "edit"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Pencil className="h-4 w-4" />
          Edition
        </button>
        <button
          onClick={() => setTab("preview")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "preview"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Eye className="h-4 w-4" />
          Apercu
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      {tab === "preview" ? (
        <div className="-mx-6 -mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <ArticlePreview
            form={form}
            categoryName={categories.find((c) => c.id === form.categoryId)?.name}
          />
        </div>
      ) : (
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
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Contenu</label>
                  <ContentEditorSwitch
                    type={form.type}
                    value={form.content}
                    onChange={(json) => updateForm("content", json)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">

            {/* ───── 1. GENERAL ───── */}
            <SidebarSection title="General" defaultOpen>
              <Field label="Template">
                <select value={form.type} onChange={(e) => updateForm("type", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none">
                  {Object.entries(articleTypeLabels).map(([v, l]) => (<option key={v} value={v}>{l}</option>))}
                </select>
              </Field>
              <Field label="Auteur">
                <div className="space-y-2">
                  {authors.map((author) => (
                    <label
                      key={author.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
                        form.authorId === author.id
                          ? "border-[#2D5A3D] bg-[#2D5A3D]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="authorId"
                        value={author.id}
                        checked={form.authorId === author.id}
                        onChange={(e) => updateForm("authorId", e.target.value)}
                        className="sr-only"
                      />
                      {author.avatar ? (
                        <img src={author.avatar} alt={author.name} className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-500">
                          {author.name.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700">{author.name}</span>
                      {form.authorId === author.id && (
                        <svg className="ml-auto h-4 w-4 text-[#2D5A3D]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      )}
                    </label>
                  ))}
                </div>
              </Field>
              <Field label="Rubrique publique" hint="Visible par les visiteurs du site">
                <select value={form.topic} onChange={(e) => updateForm("topic", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none">
                  <option value="regime">Régime</option>
                  <option value="alimentation">Alimentation</option>
                  <option value="sante">Santé</option>
                  <option value="maison">Maison</option>
                  <option value="conso">Consommation</option>
                  <option value="lifestyle">Lifestyle</option>
                </select>
              </Field>
              <Field label="Marque" hint="Usage interne uniquement (admin/tracking)">
                <select value={form.categoryId} onChange={(e) => updateForm("categoryId", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none">
                  <option value="">Sélectionner...</option>
                  {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                </select>
              </Field>
              <Field label="Image de couverture">
                <input type="text" value={form.coverImage} onChange={(e) => updateForm("coverImage", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none" placeholder="https://..." />
              </Field>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => updateForm("featured", e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[#2D5A3D]" />
                <label htmlFor="featured" className="text-sm text-gray-700">Article a la une</label>
              </div>
            </SidebarSection>

            {/* ───── 2. AFFILIATION & LIENS ───── */}
            <SidebarSection title="Affiliation & Liens" defaultOpen>
              <Field label="URL de redirection affiliee" hint="Lien principal vers le panier ou la fiche produit">
                <input type="text" value={form.affiliateUrl} onChange={(e) => updateForm("affiliateUrl", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none" placeholder="https://marque.com/panier?ref=..." />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Texte du CTA">
                  <input type="text" value={form.ctaLabel} onChange={(e) => updateForm("ctaLabel", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none" placeholder="Decouvrir l'offre" />
                </Field>
                <Field label="URL du CTA" hint="Si different de l'URL affiliee">
                  <input type="text" value={form.ctaUrl} onChange={(e) => updateForm("ctaUrl", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none" placeholder="Laisse vide = URL affiliee" />
                </Field>
              </div>
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-3">
                <p className="mb-2 text-xs font-medium text-gray-500">UTM sortants (ajoutes aux liens de redirection)</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="mb-1 block text-[11px] text-gray-400">Source</label>
                    <input type="text" value={form.outUtmSource} onChange={(e) => updateForm("outUtmSource", e.target.value)} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs focus:border-[#2D5A3D] focus:outline-none" placeholder="dailymieux" />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-gray-400">Medium</label>
                    <input type="text" value={form.outUtmMedium} onChange={(e) => updateForm("outUtmMedium", e.target.value)} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs focus:border-[#2D5A3D] focus:outline-none" placeholder="article" />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-gray-400">Campaign</label>
                    <input type="text" value={form.outUtmCampaign} onChange={(e) => updateForm("outUtmCampaign", e.target.value)} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs focus:border-[#2D5A3D] focus:outline-none" placeholder="spring_mars" />
                  </div>
                </div>
              </div>
            </SidebarSection>

            {/* ───── 3. MONETISATION ───── */}
            <SidebarSection title="Monetisation">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prix produit" hint="En euros, pour estimer le CA">
                  <div className="relative">
                    <input type="number" step="0.01" value={form.productPrice} onChange={(e) => updateForm("productPrice", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-8 text-sm focus:border-[#2D5A3D] focus:outline-none" placeholder="49.90" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">EUR</span>
                  </div>
                </Field>
                <Field label="Commission" hint="% ou montant fixe par clic/vente">
                  <div className="relative">
                    <input type="number" step="0.01" value={form.commissionRate} onChange={(e) => updateForm("commissionRate", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-8 text-sm focus:border-[#2D5A3D] focus:outline-none" placeholder="15" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                  </div>
                </Field>
              </div>
            </SidebarSection>

            {/* ───── 4. TRACKING & PIXELS ───── */}
            <SidebarSection title="Tracking & Pixels" defaultOpen>
              <div className="space-y-4">
                {/* Meta */}
                <div className="rounded-lg border border-blue-100 bg-blue-50/30 p-3">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                    <span className="h-2 w-2 rounded-full bg-blue-500" /> Meta / Facebook
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-[11px] text-gray-500">Pixel ID</label>
                      <input type="text" value={form.metaPixelId} onChange={(e) => updateForm("metaPixelId", e.target.value)} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs focus:border-blue-400 focus:outline-none" placeholder="123456789012345" />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] text-gray-500">Evenement</label>
                      <select value={form.metaEvent} onChange={(e) => updateForm("metaEvent", e.target.value)} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs focus:border-blue-400 focus:outline-none">
                        <option value="ViewContent">ViewContent</option>
                        <option value="Lead">Lead</option>
                        <option value="AddToCart">AddToCart</option>
                        <option value="InitiateCheckout">InitiateCheckout</option>
                        <option value="Purchase">Purchase</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* TikTok */}
                <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                    <span className="h-2 w-2 rounded-full bg-gray-900" /> TikTok
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-[11px] text-gray-500">Pixel ID</label>
                      <input type="text" value={form.tiktokPixelId} onChange={(e) => updateForm("tiktokPixelId", e.target.value)} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs focus:border-gray-400 focus:outline-none" placeholder="ABCDEF123456" />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] text-gray-500">Evenement</label>
                      <select value={form.tiktokEvent} onChange={(e) => updateForm("tiktokEvent", e.target.value)} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs focus:border-gray-400 focus:outline-none">
                        <option value="ViewContent">ViewContent</option>
                        <option value="ClickButton">ClickButton</option>
                        <option value="SubmitForm">SubmitForm</option>
                        <option value="CompletePayment">CompletePayment</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* GA4 */}
                <Field label="Google Analytics (GA4)" hint="Measurement ID">
                  <input type="text" value={form.gaId} onChange={(e) => updateForm("gaId", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none" placeholder="G-XXXXXXXXXX" />
                </Field>
              </div>
            </SidebarSection>

            {/* ───── 5. CAMPAGNE & SPONSOR ───── */}
            <SidebarSection title="Campagne & Sponsor">
              <Field label="Tags de campagne" hint="Separees par des virgules, pour regrouper par angle marketing">
                <input type="text" value={form.campaignTags} onChange={(e) => updateForm("campaignTags", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none" placeholder="promo_printemps, angle_expert, test_A" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nom du sponsor">
                  <input type="text" value={form.sponsorName} onChange={(e) => updateForm("sponsorName", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none" />
                </Field>
                <Field label="URL sponsor">
                  <input type="text" value={form.sponsorUrl} onChange={(e) => updateForm("sponsorUrl", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none" />
                </Field>
              </div>
            </SidebarSection>

            {/* ───── 6. SEO ───── */}
            <SidebarSection title="SEO">
              <Field label="Titre SEO">
                <input type="text" value={form.seoTitle} onChange={(e) => updateForm("seoTitle", e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none" placeholder={form.title || "Titre pour les moteurs de recherche"} />
              </Field>
              <Field label="Description SEO">
                <textarea value={form.seoDesc} onChange={(e) => updateForm("seoDesc", e.target.value)} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none" placeholder={form.excerpt || "Description pour les moteurs de recherche"} />
              </Field>
            </SidebarSection>

          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sidebar UI Components ── */

function SidebarSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50/50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-900">
          {title}
        </span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="space-y-4 border-t border-gray-100 px-5 py-4">
          {children}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}
