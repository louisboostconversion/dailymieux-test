"use client";

import RichTextEditor from "./RichTextEditor";
import RepeatableList from "./RepeatableList";

interface ListItem {
  title: string;
  body: string;
  image?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

interface ListicleData {
  items: ListItem[];
}

interface Props {
  data: ListicleData;
  onChange: (data: ListicleData) => void;
}

export default function ListicleContentEditor({ data, onChange }: Props) {
  return (
    <RepeatableList
      label="Elements de la liste"
      addLabel="Ajouter un element"
      items={data.items}
      onChange={(items) => onChange({ ...data, items })}
      createItem={() => ({ title: "", body: "" })}
      renderItem={(item, index, update) => (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2D5A3D] text-xs font-bold text-white">
              {index + 1}
            </span>
            <input
              type="text"
              value={item.title}
              onChange={(e) => update({ ...item, title: e.target.value })}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium focus:border-[#2D5A3D] focus:outline-none"
              placeholder="Titre de l'element"
            />
          </div>
          <RichTextEditor
            value={item.body}
            onChange={(body) => update({ ...item, body })}
            placeholder="Description..."
          />
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              value={item.image || ""}
              onChange={(e) => update({ ...item, image: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
              placeholder="Image URL (optionnel)"
            />
            <input
              type="text"
              value={item.ctaLabel || ""}
              onChange={(e) => update({ ...item, ctaLabel: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
              placeholder="Texte bouton"
            />
            <input
              type="text"
              value={item.ctaUrl || ""}
              onChange={(e) => update({ ...item, ctaUrl: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
              placeholder="URL bouton"
            />
          </div>
        </div>
      )}
    />
  );
}
