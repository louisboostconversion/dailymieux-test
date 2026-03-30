"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Check, X, Clock, CheckCircle2, XCircle, MessageCircle } from "lucide-react";

interface ModRequest {
  id: string;
  message: string;
  adminReply: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  article: { id: string; title: string; slug: string; coverImage: string | null; category: { name: string; color: string } };
  author: { id: string; name: string; email: string };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending: { label: "En attente", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock },
  approved: { label: "Approuvee", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: CheckCircle2 },
  done: { label: "Terminee", color: "text-green-700", bg: "bg-green-50 border-green-200", icon: Check },
  rejected: { label: "Refusee", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: XCircle },
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<ModRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  async function fetchRequests() {
    setLoading(true);
    const res = await fetch(`/api/modification-requests?status=${filter}`);
    if (res.ok) setRequests(await res.json());
    setLoading(false);
  }

  async function updateStatus(id: string, status: string, adminReply?: string) {
    const body: Record<string, string> = { status };
    if (adminReply) body.adminReply = adminReply;

    const res = await fetch(`/api/modification-requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setReplyingTo(null);
      setReplyText("");
      fetchRequests();
    }
  }

  async function submitReply(id: string) {
    if (!replyText.trim()) return;
    await updateStatus(id, "approved", replyText.trim());
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Demandes de modification</h1>
          <p className="mt-1 text-sm text-gray-500">
            {pendingCount > 0 ? `${pendingCount} demande${pendingCount > 1 ? "s" : ""} en attente` : "Aucune demande en attente"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {[
          { value: "all", label: "Toutes" },
          { value: "pending", label: "En attente" },
          { value: "approved", label: "Approuvees" },
          { value: "done", label: "Terminees" },
          { value: "rejected", label: "Refusees" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Chargement...</div>
      ) : requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-20 text-center">
          <MessageSquare className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-gray-500">Aucune demande</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const config = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
            const StatusIcon = config.icon;

            return (
              <div key={req.id} className={`rounded-xl border p-5 ${config.bg}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="mb-3 flex items-center gap-3">
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                        style={{ backgroundColor: req.article.category.color }}
                      >
                        {req.article.category.name}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{req.article.title}</span>
                    </div>

                    {/* Message */}
                    <div className="mb-3 rounded-lg bg-white/70 p-4">
                      <div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span className="font-medium">{req.author.name}</span>
                        <span>({req.author.email})</span>
                        <span>·</span>
                        <span>{new Date(req.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-gray-700">{req.message}</p>
                    </div>

                    {/* Admin reply */}
                    {req.adminReply && (
                      <div className="mb-3 ml-6 rounded-lg bg-white p-4 border border-gray-200">
                        <p className="mb-1 text-xs font-medium text-gray-500">Reponse admin :</p>
                        <p className="whitespace-pre-wrap text-sm text-gray-700">{req.adminReply}</p>
                      </div>
                    )}

                    {/* Reply form */}
                    {replyingTo === req.id && (
                      <div className="mt-3 ml-6">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Votre reponse..."
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          rows={3}
                          autoFocus
                        />
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => submitReply(req.id)}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                          >
                            Repondre & approuver
                          </button>
                          <button
                            onClick={() => { setReplyingTo(null); setReplyText(""); }}
                            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status badge + actions */}
                  <div className="flex flex-col items-end gap-2">
                    <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.color} bg-white border`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {config.label}
                    </div>

                    {req.status === "pending" && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => setReplyingTo(req.id)}
                          className="rounded-lg bg-white p-2 text-blue-600 hover:bg-blue-50 border border-blue-200"
                          title="Repondre"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateStatus(req.id, "done")}
                          className="rounded-lg bg-white p-2 text-green-600 hover:bg-green-50 border border-green-200"
                          title="Marquer comme terminee"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateStatus(req.id, "rejected")}
                          className="rounded-lg bg-white p-2 text-red-600 hover:bg-red-50 border border-red-200"
                          title="Refuser"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {req.status === "approved" && (
                      <button
                        onClick={() => updateStatus(req.id, "done")}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                      >
                        Marquer terminee
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
