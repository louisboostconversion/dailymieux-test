"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Calendar,
  Sparkles,
  Check,
  X,
  Clock,
  ChevronRight,
  FileText,
  Pencil,
  Trash2,
  RefreshCw,
  Eye,
} from "lucide-react";
import Toast from "@/components/admin/Toast";

interface PlannedArticle {
  id: string;
  title: string;
  topic: string;
  angle: string;
  keywords: string;
  outline: string;
  status: string;
  scheduledFor: string;
  articleId: string | null;
  rejectedReason: string | null;
  createdAt: string;
}

const TOPIC_LABELS: Record<string, string> = {
  regime: "Régime",
  alimentation: "Alimentation",
  sante: "Santé",
  maison: "Maison",
  conso: "Consommation",
  lifestyle: "Lifestyle",
};

const TOPIC_COLORS: Record<string, string> = {
  regime: "bg-green-100 text-green-700",
  alimentation: "bg-orange-100 text-orange-700",
  sante: "bg-emerald-100 text-emerald-700",
  maison: "bg-purple-100 text-purple-700",
  conso: "bg-blue-100 text-blue-700",
  lifestyle: "bg-pink-100 text-pink-700",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  planned: { label: "Planifié", color: "text-amber-600 bg-amber-50", icon: Clock },
  approved: { label: "Approuvé", color: "text-blue-600 bg-blue-50", icon: Check },
  generating: { label: "Génération...", color: "text-purple-600 bg-purple-50", icon: Sparkles },
  published: { label: "Publié", color: "text-green-600 bg-green-50", icon: FileText },
  rejected: { label: "Rejeté", color: "text-red-600 bg-red-50", icon: X },
};

export default function EditorialPage() {
  const [articles, setArticles] = useState<PlannedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [planning, setPlanning] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", angle: "", keywords: "", topic: "" });
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchArticles = useCallback(() => {
    setLoading(true);
    fetch("/api/editorial")
      .then((r) => r.json())
      .then(setArticles)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  async function handleAutoPlan() {
    setPlanning(true);
    const res = await fetch("/api/editorial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "auto-plan" }),
    });
    const data = await res.json();
    setPlanning(false);
    if (data.created > 0) {
      setToast({ message: `${data.created} articles planifiés pour les prochaines semaines`, type: "success" });
      fetchArticles();
    } else {
      setToast({ message: data.message || "Aucun article à planifier", type: "error" });
    }
  }

  async function handleApprove(id: string) {
    await fetch(`/api/editorial/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    setToast({ message: "Article approuvé", type: "success" });
    fetchArticles();
  }

  async function handleReject(id: string) {
    if (!rejectReason.trim()) return;
    await fetch(`/api/editorial/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected", rejectedReason: rejectReason.trim() }),
    });
    setRejectingId(null);
    setRejectReason("");
    setToast({ message: "Article rejeté", type: "success" });
    fetchArticles();
  }

  async function handleGenerate(id: string) {
    setGeneratingId(id);
    setToast({ message: "Génération de l'article en cours... (30-60 secondes)", type: "success" });

    const res = await fetch("/api/editorial/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plannedArticleId: id }),
    });

    const data = await res.json();
    setGeneratingId(null);

    if (res.ok && data.success) {
      setToast({ message: `Article "${data.article.title}" publié avec succès !`, type: "success" });
      fetchArticles();
    } else {
      setToast({ message: data.error || "Erreur lors de la génération", type: "error" });
      fetchArticles();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet article planifié ?")) return;
    await fetch(`/api/editorial/${id}`, { method: "DELETE" });
    fetchArticles();
  }

  async function handleEdit(id: string) {
    const res = await fetch(`/api/editorial/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      setEditingId(null);
      setToast({ message: "Article modifié", type: "success" });
      fetchArticles();
    }
  }

  function startEdit(article: PlannedArticle) {
    setEditingId(article.id);
    setEditForm({
      title: article.title,
      angle: article.angle,
      keywords: article.keywords,
      topic: article.topic,
    });
  }

  // Group articles by week
  function groupByWeek(items: PlannedArticle[]) {
    const weeks: Record<string, PlannedArticle[]> = {};
    for (const item of items) {
      const date = new Date(item.scheduledFor);
      const monday = new Date(date);
      monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
      const key = monday.toISOString().slice(0, 10);
      if (!weeks[key]) weeks[key] = [];
      weeks[key].push(item);
    }
    return Object.entries(weeks).sort(([a], [b]) => a.localeCompare(b));
  }

  const weeks = groupByWeek(articles);
  const pendingCount = articles.filter((a) => a.status === "planned").length;

  function getWeekLabel(mondayStr: string) {
    const monday = new Date(mondayStr);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    const now = new Date();
    const thisMonday = new Date(now);
    thisMonday.setDate(thisMonday.getDate() - ((thisMonday.getDay() + 6) % 7));
    thisMonday.setHours(0, 0, 0, 0);

    const diff = Math.round((monday.getTime() - thisMonday.getTime()) / (7 * 24 * 60 * 60 * 1000));

    let label = "";
    if (diff === 0) label = "Cette semaine";
    else if (diff === 1) label = "Semaine prochaine";
    else if (diff > 1) label = `Dans ${diff} semaines`;
    else label = "Semaine passée";

    const format = (d: Date) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    return `${label} — ${format(monday)} au ${format(sunday)}`;
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} visible={!!toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendrier éditorial</h1>
          <p className="mt-1 text-sm text-gray-500">
            {pendingCount > 0
              ? `${pendingCount} article${pendingCount > 1 ? "s" : ""} en attente de validation`
              : "Tous les articles sont validés"}
          </p>
        </div>
        <button
          onClick={handleAutoPlan}
          disabled={planning}
          className="flex items-center gap-2 rounded-xl bg-[#2D5A3D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#234a31] disabled:opacity-50 transition-colors"
        >
          {planning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {planning ? "Planification..." : "Planifier les 3 prochaines semaines"}
        </button>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-2">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <span key={key} className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${config.color}`}>
            <config.icon className="h-3 w-3" />
            {config.label}
          </span>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2D5A3D] border-t-transparent" />
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-300 py-20 text-center">
          <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-500">Aucun article planifié</h3>
          <p className="mt-1 text-sm text-gray-400">
            Cliquez sur &quot;Planifier les 3 prochaines semaines&quot; pour démarrer
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {weeks.map(([monday, weekArticles]) => (
            <div key={monday}>
              {/* Week header */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  {getWeekLabel(monday)}
                </h2>
              </div>

              {/* Articles */}
              <div className="space-y-3">
                {weekArticles.map((article) => {
                  const statusConf = STATUS_CONFIG[article.status] || STATUS_CONFIG.planned;
                  const StatusIcon = statusConf.icon;

                  return (
                    <div key={article.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                      {editingId === article.id ? (
                        /* Edit mode */
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium focus:border-[#2D5A3D] focus:outline-none"
                          />
                          <div className="flex gap-3">
                            <select
                              value={editForm.topic}
                              onChange={(e) => setEditForm({ ...editForm, topic: e.target.value })}
                              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            >
                              {Object.entries(TOPIC_LABELS).map(([k, v]) => (
                                <option key={k} value={k}>{v}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={editForm.keywords}
                              onChange={(e) => setEditForm({ ...editForm, keywords: e.target.value })}
                              placeholder="Mots-clés SEO"
                              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
                            />
                          </div>
                          <textarea
                            value={editForm.angle}
                            onChange={(e) => setEditForm({ ...editForm, angle: e.target.value })}
                            rows={2}
                            placeholder="Angle éditorial"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(article.id)} className="rounded-lg bg-[#2D5A3D] px-4 py-2 text-sm font-medium text-white">
                              Sauvegarder
                            </button>
                            <button onClick={() => setEditingId(null)} className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-600">
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Display mode */
                        <div className="flex items-start gap-4">
                          {/* Left: content */}
                          <div className="flex-1 min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TOPIC_COLORS[article.topic] || "bg-gray-100 text-gray-600"}`}>
                                {TOPIC_LABELS[article.topic] || article.topic}
                              </span>
                              <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConf.color}`}>
                                <StatusIcon className="h-3 w-3" />
                                {statusConf.label}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(article.scheduledFor).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                              </span>
                            </div>

                            <h3 className="mb-1 text-base font-bold text-gray-900">{article.title}</h3>
                            <p className="mb-2 text-sm text-gray-500">{article.angle}</p>

                            {article.keywords && (
                              <div className="flex flex-wrap gap-1">
                                {article.keywords.split(",").map((kw, i) => (
                                  <span key={i} className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                                    {kw.trim()}
                                  </span>
                                ))}
                              </div>
                            )}

                            {article.rejectedReason && (
                              <div className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 border border-red-100">
                                Raison du rejet : {article.rejectedReason}
                              </div>
                            )}

                            {/* Reject form */}
                            {rejectingId === article.id && (
                              <div className="mt-3 space-y-2">
                                <textarea
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                  placeholder="Pourquoi rejeter cet article ?"
                                  rows={2}
                                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-400 focus:outline-none"
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <button onClick={() => handleReject(article.id)} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white">
                                    Confirmer le rejet
                                  </button>
                                  <button onClick={() => { setRejectingId(null); setRejectReason(""); }} className="text-xs text-gray-400">
                                    Annuler
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right: actions */}
                          <div className="flex shrink-0 items-center gap-1">
                            {article.status === "planned" && (
                              <>
                                <button
                                  onClick={() => handleApprove(article.id)}
                                  className="rounded-lg bg-green-50 p-2 text-green-600 hover:bg-green-100 transition-colors"
                                  title="Approuver"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setRejectingId(article.id)}
                                  className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100 transition-colors"
                                  title="Rejeter"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            {article.status === "approved" && (
                              <button
                                onClick={() => handleGenerate(article.id)}
                                disabled={generatingId === article.id}
                                className="flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-2 text-xs font-medium text-purple-700 hover:bg-purple-100 disabled:opacity-50 transition-colors"
                                title="Générer l'article avec l'IA"
                              >
                                {generatingId === article.id ? (
                                  <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Génération...</>
                                ) : (
                                  <><Sparkles className="h-3.5 w-3.5" /> Générer</>
                                )}
                              </button>
                            )}
                            {article.status === "generating" && (
                              <span className="flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-2 text-xs font-medium text-purple-600">
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" /> En cours...
                              </span>
                            )}
                            {article.status === "published" && article.articleId && (
                              <a
                                href={`/admin/articles/${article.articleId}/edit`}
                                className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 transition-colors"
                                title="Voir l'article"
                              >
                                <Eye className="h-4 w-4" />
                              </a>
                            )}
                            {["planned", "rejected"].includes(article.status) && (
                              <>
                                <button
                                  onClick={() => startEdit(article)}
                                  className="rounded-lg bg-gray-50 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                                  title="Modifier"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(article.id)}
                                  className="rounded-lg bg-gray-50 p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                  title="Supprimer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
