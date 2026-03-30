"use client";

import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

interface RepeatableListProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  renderItem: (item: T, index: number, update: (item: T) => void) => React.ReactNode;
  label: string;
  addLabel?: string;
  maxItems?: number;
}

export default function RepeatableList<T>({
  items,
  onChange,
  createItem,
  renderItem,
  label,
  addLabel = "Ajouter",
  maxItems = 50,
}: RepeatableListProps<T>) {
  function add() {
    if (items.length >= maxItems) return;
    onChange([...items, createItem()]);
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function update(index: number, item: T) {
    const next = [...items];
    next[index] = item;
    onChange(next);
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }

  function moveDown(index: number) {
    if (index === items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">{label}</h4>
        <button
          type="button"
          onClick={add}
          disabled={items.length >= maxItems}
          className="inline-flex items-center gap-1 rounded-lg bg-[#2D5A3D]/10 px-3 py-1.5 text-xs font-medium text-[#2D5A3D] hover:bg-[#2D5A3D]/20 disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="relative rounded-lg border border-gray-200 bg-gray-50/50 p-4">
          <div className="absolute right-2 top-2 flex gap-1">
            <button
              type="button"
              onClick={() => moveUp(index)}
              disabled={index === 0}
              className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-30"
              title="Monter"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => moveDown(index)}
              disabled={index === items.length - 1}
              className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-30"
              title="Descendre"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => remove(index)}
              className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
              title="Supprimer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="pr-20">
            {renderItem(item, index, (updated) => update(index, updated))}
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-gray-300 py-6 text-center text-sm text-gray-400">
          Aucun element. Cliquez sur &quot;{addLabel}&quot; pour commencer.
        </p>
      )}
    </div>
  );
}
