"use client";

import RichTextEditor from "./RichTextEditor";
import RepeatableList from "./RepeatableList";
import StringList from "./StringList";

interface Criterion {
  name: string;
  score: number;
}

interface Alternative {
  name: string;
  url?: string;
}

interface ReviewData {
  overallScore: number;
  criteria: Criterion[];
  pros: string[];
  cons: string[];
  forWho: string;
  alternatives: Alternative[];
  body: string;
}

interface Props {
  data: ReviewData;
  onChange: (data: ReviewData) => void;
}

export default function ReviewContentEditor({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Score global */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">
          Score global
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={data.overallScore}
            onChange={(e) =>
              onChange({ ...data, overallScore: parseFloat(e.target.value) })
            }
            className="flex-1 accent-[#2D5A3D]"
          />
          <span className="w-12 rounded-lg bg-[#2D5A3D] py-1.5 text-center text-sm font-bold text-white">
            {data.overallScore}
          </span>
        </div>
      </div>

      {/* Criteres */}
      <RepeatableList
        label="Criteres de notation"
        addLabel="Ajouter un critere"
        items={data.criteria}
        onChange={(criteria) => onChange({ ...data, criteria })}
        createItem={() => ({ name: "", score: 5 })}
        renderItem={(item, _index, update) => (
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={item.name}
              onChange={(e) => update({ ...item, name: e.target.value })}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
              placeholder="Nom du critere"
            />
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={item.score}
              onChange={(e) =>
                update({ ...item, score: parseFloat(e.target.value) })
              }
              className="w-32 accent-[#2D5A3D]"
            />
            <span className="w-10 text-center text-sm font-semibold text-gray-700">
              {item.score}
            </span>
          </div>
        )}
      />

      {/* Pros & Cons */}
      <div className="grid grid-cols-2 gap-4">
        <StringList
          label="Avantages"
          items={data.pros}
          onChange={(pros) => onChange({ ...data, pros })}
          placeholder="Un avantage..."
          addLabel="Ajouter"
        />
        <StringList
          label="Inconvenients"
          items={data.cons}
          onChange={(cons) => onChange({ ...data, cons })}
          placeholder="Un inconvenient..."
          addLabel="Ajouter"
        />
      </div>

      {/* Pour qui */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">
          Pour qui ?
        </label>
        <textarea
          value={data.forWho}
          onChange={(e) => onChange({ ...data, forWho: e.target.value })}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
          placeholder="Ce produit est ideal pour..."
        />
      </div>

      {/* Alternatives */}
      <RepeatableList
        label="Alternatives"
        addLabel="Ajouter une alternative"
        items={data.alternatives}
        onChange={(alternatives) => onChange({ ...data, alternatives })}
        createItem={() => ({ name: "" })}
        renderItem={(item, _index, update) => (
          <div className="flex gap-3">
            <input
              type="text"
              value={item.name}
              onChange={(e) => update({ ...item, name: e.target.value })}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
              placeholder="Nom de l'alternative"
            />
            <input
              type="text"
              value={item.url || ""}
              onChange={(e) => update({ ...item, url: e.target.value })}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
              placeholder="URL (optionnel)"
            />
          </div>
        )}
      />

      {/* Corps */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">
          Contenu detaille
        </label>
        <RichTextEditor
          value={data.body}
          onChange={(body) => onChange({ ...data, body })}
          placeholder="Redigez votre avis detaille..."
        />
      </div>
    </div>
  );
}
