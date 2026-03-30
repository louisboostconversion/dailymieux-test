"use client";

import RichTextEditor from "./RichTextEditor";
import RepeatableList from "./RepeatableList";

interface Section {
  title: string;
  body: string;
}

interface Product {
  name: string;
  image?: string;
  description: string;
  price?: string;
  ctaLabel: string;
  ctaUrl: string;
}

interface AdvertorialData {
  sections: Section[];
  products: Product[];
  verdict: string;
}

interface Props {
  data: AdvertorialData;
  onChange: (data: AdvertorialData) => void;
}

export default function AdvertorialContentEditor({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <RepeatableList
        label="Sections"
        addLabel="Ajouter une section"
        items={data.sections}
        onChange={(sections) => onChange({ ...data, sections })}
        createItem={() => ({ title: "", body: "" })}
        renderItem={(item, _index, update) => (
          <div className="space-y-3">
            <input
              type="text"
              value={item.title}
              onChange={(e) => update({ ...item, title: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium focus:border-[#2D5A3D] focus:outline-none"
              placeholder="Titre de la section"
            />
            <RichTextEditor
              value={item.body}
              onChange={(body) => update({ ...item, body })}
              placeholder="Contenu de la section..."
            />
          </div>
        )}
      />

      <RepeatableList
        label="Produits"
        addLabel="Ajouter un produit"
        items={data.products}
        onChange={(products) => onChange({ ...data, products })}
        createItem={() => ({
          name: "",
          description: "",
          price: "",
          ctaLabel: "Decouvrir",
          ctaUrl: "",
        })}
        renderItem={(item, _index, update) => (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={item.name}
                onChange={(e) => update({ ...item, name: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
                placeholder="Nom du produit"
              />
              <input
                type="text"
                value={item.price || ""}
                onChange={(e) => update({ ...item, price: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
                placeholder="Prix (ex: 29,99 EUR)"
              />
            </div>
            <textarea
              value={item.description}
              onChange={(e) => update({ ...item, description: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
              placeholder="Description du produit..."
            />
            <input
              type="text"
              value={item.image || ""}
              onChange={(e) => update({ ...item, image: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
              placeholder="URL de l'image (optionnel)"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={item.ctaLabel}
                onChange={(e) => update({ ...item, ctaLabel: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
                placeholder="Texte du bouton"
              />
              <input
                type="text"
                value={item.ctaUrl}
                onChange={(e) => update({ ...item, ctaUrl: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
                placeholder="URL du bouton"
              />
            </div>
          </div>
        )}
      />

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">
          Verdict
        </label>
        <textarea
          value={data.verdict}
          onChange={(e) => onChange({ ...data, verdict: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
          placeholder="Votre verdict final..."
        />
      </div>
    </div>
  );
}
