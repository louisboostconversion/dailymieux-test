"use client";

import RichTextEditor from "./RichTextEditor";
import RepeatableList from "./RepeatableList";
import StringList from "./StringList";

interface Product {
  name: string;
  image?: string;
  ratings: Record<string, number>;
  pros: string[];
  cons: string[];
  price?: string;
  ctaUrl?: string;
  badge?: string;
}

interface Section {
  title: string;
  body: string;
}

interface ComparativeData {
  criteria: string[];
  products: Product[];
  winner: string;
  verdict: string;
  sections: Section[];
}

interface Props {
  data: ComparativeData;
  onChange: (data: ComparativeData) => void;
}

export default function ComparativeContentEditor({ data, onChange }: Props) {
  function updateCriteria(criteria: string[]) {
    // When criteria change, update product ratings keys accordingly
    const products = data.products.map((p) => {
      const newRatings: Record<string, number> = {};
      for (const c of criteria) {
        newRatings[c] = p.ratings[c] ?? 3;
      }
      return { ...p, ratings: newRatings };
    });
    onChange({ ...data, criteria, products });
  }

  return (
    <div className="space-y-6">
      {/* Criteres */}
      <StringList
        label="Criteres de comparaison"
        items={data.criteria}
        onChange={updateCriteria}
        placeholder="Ex: Qualite, Prix, Design..."
        addLabel="Ajouter un critere"
      />

      {/* Produits */}
      <RepeatableList
        label="Produits a comparer"
        addLabel="Ajouter un produit"
        items={data.products}
        onChange={(products) => onChange({ ...data, products })}
        createItem={() => ({
          name: "",
          ratings: Object.fromEntries(data.criteria.map((c) => [c, 3])),
          pros: [],
          cons: [],
        })}
        renderItem={(item, _index, update) => (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={item.name}
                onChange={(e) => update({ ...item, name: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium focus:border-[#2D5A3D] focus:outline-none"
                placeholder="Nom du produit"
              />
              <input
                type="text"
                value={item.badge || ""}
                onChange={(e) => update({ ...item, badge: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
                placeholder="Badge (ex: Meilleur choix)"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={item.price || ""}
                onChange={(e) => update({ ...item, price: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
                placeholder="Prix"
              />
              <input
                type="text"
                value={item.ctaUrl || ""}
                onChange={(e) => update({ ...item, ctaUrl: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
                placeholder="URL d'achat"
              />
            </div>
            <input
              type="text"
              value={item.image || ""}
              onChange={(e) => update({ ...item, image: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
              placeholder="Image URL (optionnel)"
            />

            {/* Ratings per criterion */}
            {data.criteria.length > 0 && (
              <div className="space-y-2 rounded-lg bg-white p-3">
                <p className="text-xs font-medium text-gray-500 uppercase">Notes</p>
                {data.criteria.map((criterion) => (
                  <div key={criterion} className="flex items-center gap-3">
                    <span className="w-24 truncate text-xs text-gray-600">
                      {criterion}
                    </span>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={item.ratings[criterion] ?? 3}
                      onChange={(e) =>
                        update({
                          ...item,
                          ratings: {
                            ...item.ratings,
                            [criterion]: parseInt(e.target.value),
                          },
                        })
                      }
                      className="flex-1 accent-[#2D5A3D]"
                    />
                    <span className="w-6 text-center text-xs font-semibold">
                      {item.ratings[criterion] ?? 3}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <StringList
                label="Avantages"
                items={item.pros}
                onChange={(pros) => update({ ...item, pros })}
                placeholder="Avantage..."
              />
              <StringList
                label="Inconvenients"
                items={item.cons}
                onChange={(cons) => update({ ...item, cons })}
                placeholder="Inconvenient..."
              />
            </div>
          </div>
        )}
      />

      {/* Winner */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">
          Gagnant
        </label>
        <select
          value={data.winner}
          onChange={(e) => onChange({ ...data, winner: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#2D5A3D] focus:outline-none"
        >
          <option value="">Selectionner le gagnant...</option>
          {data.products.map((p, i) => (
            <option key={i} value={p.name}>
              {p.name || `Produit ${i + 1}`}
            </option>
          ))}
        </select>
      </div>

      {/* Verdict */}
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

      {/* Sections editoriales */}
      <RepeatableList
        label="Sections editoriales (optionnel)"
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
              placeholder="Contenu..."
            />
          </div>
        )}
      />
    </div>
  );
}
