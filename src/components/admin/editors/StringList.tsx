"use client";

import { Plus, Trash2 } from "lucide-react";

interface StringListProps {
  items: string[];
  onChange: (items: string[]) => void;
  label: string;
  placeholder?: string;
  addLabel?: string;
}

export default function StringList({
  items,
  onChange,
  label,
  placeholder = "",
  addLabel = "Ajouter",
}: StringListProps) {
  const safeItems = items || [];

  function add() {
    onChange([...safeItems, ""]);
  }

  function update(index: number, value: string) {
    const next = [...safeItems];
    next[index] = value;
    onChange(next);
  }

  function remove(index: number) {
    onChange(safeItems.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#2D5A3D] hover:text-[#234a31]"
        >
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </button>
      </div>
      {safeItems.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => update(index, e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
