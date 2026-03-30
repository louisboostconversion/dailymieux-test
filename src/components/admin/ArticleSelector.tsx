"use client";

import { useState } from "react";
import { FileText, X, ChevronDown, Search } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: { name: string };
}

interface ArticleSelectorProps {
  articles: Article[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export default function ArticleSelector({ articles, selectedIds, onChange }: ArticleSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  function toggle(id: string) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id]
    );
  }

  const selectedArticles = articles.filter((a) => selectedIds.includes(a.id));

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <FileText className="h-3.5 w-3.5 text-gray-400" />
        {selectedIds.length === 0
          ? "Tous les articles"
          : `${selectedIds.length} article${selectedIds.length > 1 ? "s" : ""}`}
        <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
            {/* Search */}
            <div className="border-b p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Chercher un article..."
                  className="w-full rounded-md border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-[#2D5A3D] focus:bg-white"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-b px-3 py-1.5">
              <button
                onClick={() => onChange([])}
                className="text-[11px] text-gray-500 hover:text-gray-700"
              >
                Tout désélectionner
              </button>
              <span className="text-[11px] text-gray-400">
                {selectedIds.length}/{articles.length}
              </span>
            </div>

            {/* List */}
            <div className="max-h-60 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="px-3 py-4 text-center text-xs text-gray-400">Aucun article trouve</p>
              ) : (
                filtered.map((a) => {
                  const isSelected = selectedIds.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      onClick={() => toggle(a.id)}
                      className={`flex w-full items-start gap-2 px-3 py-2 text-left text-xs hover:bg-gray-50 ${isSelected ? "bg-[#2D5A3D]/5" : ""}`}
                    >
                      <span className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border text-[8px] ${isSelected ? "border-[#2D5A3D] bg-[#2D5A3D] text-white" : "border-gray-300"}`}>
                        {isSelected ? "✓" : ""}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-800">{a.title}</p>
                        <p className="text-[10px] text-gray-400">{a.category.name}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {selectedIds.length > 0 && (
              <div className="border-t px-3 py-2">
                <button
                  onClick={() => setOpen(false)}
                  className="w-full rounded-md bg-[#2D5A3D] py-1.5 text-xs font-medium text-white hover:bg-[#234a31]"
                >
                  Appliquer ({selectedIds.length} articles)
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Selected chips */}
      {selectedIds.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selectedArticles.slice(0, 3).map((a) => (
            <span key={a.id} className="inline-flex items-center gap-1 rounded-full bg-[#2D5A3D]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#2D5A3D]">
              {a.title.length > 30 ? a.title.substring(0, 30) + "..." : a.title}
              <button onClick={() => toggle(a.id)} className="hover:opacity-60">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {selectedArticles.length > 3 && (
            <span className="text-[11px] text-gray-400">+{selectedArticles.length - 3} autres</span>
          )}
        </div>
      )}
    </div>
  );
}
