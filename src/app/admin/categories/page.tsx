"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  order: number;
  _count: { articles: number };
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState({ name: "", description: "", icon: "", color: "#2D5A3D" });
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  }

  async function handleCreate() {
    if (!newCat.name) return;
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCat),
    });
    setNewCat({ name: "", description: "", icon: "", color: "#2D5A3D" });
    setShowNew(false);
    fetchCategories();
  }

  async function handleUpdate(id: string, data: Partial<Category>) {
    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchCategories();
  }

  async function handleDelete(id: string, name: string, articleCount: number) {
    if (articleCount > 0) {
      alert(`Impossible de supprimer "${name}" car elle contient ${articleCount} article(s).`);
      return;
    }
    if (!confirm(`Supprimer la catégorie "${name}" ?`)) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
        <button
          onClick={() => setShowNew(!showNew)}
          className="flex items-center gap-2 rounded-lg bg-[#2D5A3D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#234a31]"
        >
          <Plus className="h-4 w-4" />
          Nouvelle catégorie
        </button>
      </div>

      {showNew && (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">Nouvelle catégorie</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Nom"
              value={newCat.name}
              onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none"
            />
            <input
              type="text"
              placeholder="Icône (emoji)"
              value={newCat.icon}
              onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none"
            />
            <input
              type="text"
              placeholder="Description"
              value={newCat.description}
              onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none sm:col-span-2"
            />
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newCat.color}
                onChange={(e) => setNewCat({ ...newCat, color: e.target.value })}
                className="h-10 w-10 rounded border border-gray-300"
              />
              <span className="text-sm text-gray-500">Couleur</span>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 rounded-lg bg-[#2D5A3D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#234a31]"
              >
                <Save className="h-4 w-4" />
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Chargement...</div>
        ) : (
          <div className="divide-y">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
                    style={{ backgroundColor: (cat.color || "#2D5A3D") + "20" }}
                  >
                    {cat.icon || "📁"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{cat.name}</p>
                    <p className="text-sm text-gray-500">
                      {cat.description || "Pas de description"} · {cat._count.articles} article(s)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    defaultValue={cat.description || ""}
                    onBlur={(e) => {
                      if (e.target.value !== (cat.description || "")) {
                        handleUpdate(cat.id, { description: e.target.value });
                      }
                    }}
                    className="hidden w-48 rounded-lg border border-gray-200 px-2 py-1 text-sm md:block"
                    placeholder="Description..."
                  />
                  <button
                    onClick={() => handleDelete(cat.id, cat.name, cat._count.articles)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
