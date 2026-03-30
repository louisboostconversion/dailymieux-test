"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Mail,
  Loader2,
} from "lucide-react";

interface Request {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function DemandesPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const res = await fetch("/api/requests");
      const data = await res.json();
      setRequests(data);
    } catch {
      console.error("Erreur lors du chargement des demandes");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, status: status as Request["status"] } : r
          )
        );
      }
    } catch {
      console.error("Erreur lors de la mise à jour");
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteRequest(id: string) {
    if (!confirm("Supprimer cette demande ?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/requests/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {
      console.error("Erreur lors de la suppression");
    } finally {
      setActionLoading(null);
    }
  }

  const filtered =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const statusConfig = {
    pending: {
      label: "En attente",
      color: "bg-amber-100 text-amber-700",
      icon: Clock,
    },
    approved: {
      label: "Validée",
      color: "bg-green-100 text-green-700",
      icon: CheckCircle,
    },
    rejected: {
      label: "Refusée",
      color: "bg-red-100 text-red-700",
      icon: XCircle,
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(
          [
            { key: "all", label: "Toutes", color: "bg-gray-500" },
            { key: "pending", label: "En attente", color: "bg-amber-500" },
            { key: "approved", label: "Validées", color: "bg-green-500" },
            { key: "rejected", label: "Refusées", color: "bg-red-500" },
          ] as const
        ).map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`rounded-xl p-4 text-left shadow-sm transition-all ${
              filter === s.key
                ? "ring-2 ring-[#2D5A3D] bg-white"
                : "bg-white hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-3 w-3 rounded-full ${s.color}`}
              />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {counts[s.key]}
                </p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <Mail className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-gray-500">Aucune demande</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => {
            const config = statusConfig[req.status];
            const StatusIcon = config.icon;
            const isLoading = actionLoading === req.id;

            return (
              <div
                key={req.id}
                className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-gray-900">
                        {req.firstName} {req.lastName}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{req.email}</p>
                    <p className="text-sm leading-relaxed text-gray-700">
                      {req.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(req.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    ) : (
                      <>
                        {req.status !== "approved" && (
                          <button
                            onClick={() => updateStatus(req.id, "approved")}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
                            title="Valider"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Valider
                          </button>
                        )}
                        {req.status !== "rejected" && (
                          <button
                            onClick={() => updateStatus(req.id, "rejected")}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                            title="Refuser"
                          >
                            <XCircle className="h-4 w-4" />
                            Refuser
                          </button>
                        )}
                        {req.status !== "pending" && (
                          <button
                            onClick={() => updateStatus(req.id, "pending")}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100"
                            title="Remettre en attente"
                          >
                            <Clock className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteRequest(req.id)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
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
