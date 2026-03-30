"use client";

import { useState } from "react";
import { Code, Eye } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import RepeatableList from "./RepeatableList";

// Detect if HTML contains complex elements that TipTap can't handle
function hasComplexHtml(html: string): boolean {
  if (!html) return false;
  return /<table[\s>]|<iframe[\s>]|<video[\s>]|<embed[\s>]|<object[\s>]|<style[\s>]/i.test(html);
}

function HtmlEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [mode, setMode] = useState<"visual" | "code">(hasComplexHtml(value) ? "code" : "visual");

  return (
    <div>
      <div className="mb-2 flex items-center gap-1">
        <button
          type="button"
          onClick={() => setMode("visual")}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            mode === "visual" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          <Eye className="h-3 w-3" />
          Visuel
        </button>
        <button
          type="button"
          onClick={() => setMode("code")}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            mode === "code" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          <Code className="h-3 w-3" />
          HTML
        </button>
        {hasComplexHtml(value) && (
          <span className="ml-2 text-[10px] text-amber-600 font-medium">
            Contient du HTML complexe (tableau, etc.)
          </span>
        )}
      </div>
      {mode === "visual" ? (
        <RichTextEditor value={value} onChange={onChange} placeholder="Contenu de la section..." />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={12}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs leading-relaxed text-gray-700 focus:border-[#2D5A3D] focus:outline-none"
          placeholder="<p>Contenu HTML...</p>"
          spellCheck={false}
        />
      )}
    </div>
  );
}

interface Section {
  id: string;
  title: string;
  body: string;
}

interface Tip {
  title: string;
  body: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface GuideData {
  sections: Section[];
  tips: Tip[];
  faq: FaqItem[];
}

interface Props {
  data: GuideData;
  onChange: (data: GuideData) => void;
}

export default function GuideContentEditor({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <RepeatableList
        label="Sections"
        addLabel="Ajouter une section"
        items={data.sections}
        onChange={(sections) => onChange({ ...data, sections })}
        createItem={() => ({
          id: `section-${Date.now()}`,
          title: "",
          body: "",
        })}
        renderItem={(item, _index, update) => (
          <div className="space-y-3">
            <input
              type="text"
              value={item.title}
              onChange={(e) => update({ ...item, title: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium focus:border-[#2D5A3D] focus:outline-none"
              placeholder="Titre de la section"
            />
            <HtmlEditor
              value={item.body}
              onChange={(body) => update({ ...item, body })}
            />
          </div>
        )}
      />

      <RepeatableList
        label="Conseils"
        addLabel="Ajouter un conseil"
        items={data.tips}
        onChange={(tips) => onChange({ ...data, tips })}
        createItem={() => ({ title: "", body: "" })}
        renderItem={(item, _index, update) => (
          <div className="space-y-3">
            <input
              type="text"
              value={item.title}
              onChange={(e) => update({ ...item, title: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium focus:border-[#2D5A3D] focus:outline-none"
              placeholder="Titre du conseil"
            />
            <textarea
              value={item.body}
              onChange={(e) => update({ ...item, body: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
              placeholder="Description du conseil..."
            />
          </div>
        )}
      />

      <RepeatableList
        label="FAQ"
        addLabel="Ajouter une question"
        items={data.faq}
        onChange={(faq) => onChange({ ...data, faq })}
        createItem={() => ({ question: "", answer: "" })}
        renderItem={(item, _index, update) => (
          <div className="space-y-3">
            <input
              type="text"
              value={item.question}
              onChange={(e) => update({ ...item, question: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium focus:border-[#2D5A3D] focus:outline-none"
              placeholder="Question ?"
            />
            <textarea
              value={item.answer}
              onChange={(e) => update({ ...item, answer: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
              placeholder="Reponse..."
            />
          </div>
        )}
      />
    </div>
  );
}
