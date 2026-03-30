"use client";

import { useState } from "react";
import { Globe, Megaphone, Hash, FileText, MousePointerClick } from "lucide-react";

interface UTMRow {
  label: string;
  sublabel?: string;
  count: number;
  avgTimeOnPage?: number;
  avgScrollDepth?: number;
}

interface UTMTableProps {
  sourceData: { source: string; medium: string; count: number; avgTimeOnPage: number; avgScrollDepth: number }[];
  campaignData: { campaign: string; count: number; avgTimeOnPage: number; avgScrollDepth: number }[];
  termData: { term: string; count: number; avgTimeOnPage: number; avgScrollDepth: number }[];
  contentData: { content: string; count: number; avgTimeOnPage: number; avgScrollDepth: number }[];
  ctaData: { label: string; count: number }[];
  totalPageViews: number;
}

const TABS = [
  { id: "source", label: "Source / Medium", icon: Globe },
  { id: "campaign", label: "Campagnes", icon: Megaphone },
  { id: "term", label: "Termes", icon: Hash },
  { id: "content", label: "Contenu", icon: FileText },
  { id: "cta", label: "CTA Clics", icon: MousePointerClick },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function UTMTable({
  sourceData,
  campaignData,
  termData,
  contentData,
  ctaData,
  totalPageViews,
}: UTMTableProps) {
  const [activeTab, setActiveTab] = useState<TabId>("source");

  function getRows(): UTMRow[] {
    switch (activeTab) {
      case "source":
        return sourceData.map((s) => ({
          label: s.source,
          sublabel: s.medium,
          count: s.count,
          avgTimeOnPage: s.avgTimeOnPage,
          avgScrollDepth: s.avgScrollDepth,
        }));
      case "campaign":
        return campaignData.map((c) => ({
          label: c.campaign || "(vide)",
          count: c.count,
          avgTimeOnPage: c.avgTimeOnPage,
          avgScrollDepth: c.avgScrollDepth,
        }));
      case "term":
        return termData.map((t) => ({
          label: t.term || "(vide)",
          count: t.count,
          avgTimeOnPage: t.avgTimeOnPage,
          avgScrollDepth: t.avgScrollDepth,
        }));
      case "content":
        return contentData.map((c) => ({
          label: c.content || "(vide)",
          count: c.count,
          avgTimeOnPage: c.avgTimeOnPage,
          avgScrollDepth: c.avgScrollDepth,
        }));
      case "cta":
        return ctaData.map((c) => ({
          label: c.label || "(sans label)",
          count: c.count,
        }));
    }
  }

  const rows = getRows();
  const showEngagement = activeTab !== "cta";
  const maxCount = rows.length > 0 ? Math.max(...rows.map((r) => r.count)) : 1;

  return (
    <div className="rounded-xl bg-white shadow-sm">
      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count =
            tab.id === "source"
              ? sourceData.length
              : tab.id === "campaign"
              ? campaignData.length
              : tab.id === "term"
              ? termData.length
              : tab.id === "content"
              ? contentData.length
              : ctaData.length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-5 py-3 text-xs font-medium transition-colors ${
                isActive
                  ? "border-[#2D5A3D] text-[#2D5A3D]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
              {count > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${isActive ? "bg-[#2D5A3D]/10 text-[#2D5A3D]" : "bg-gray-100 text-gray-400"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50/50 text-left text-xs font-medium uppercase text-gray-500">
              <th className="px-6 py-3">
                {activeTab === "source"
                  ? "Source / Medium"
                  : activeTab === "campaign"
                  ? "Campagne"
                  : activeTab === "term"
                  ? "Terme"
                  : activeTab === "content"
                  ? "Contenu"
                  : "CTA"}
              </th>
              <th className="px-6 py-3 text-right">Sessions</th>
              <th className="px-6 py-3 text-right">% Trafic</th>
              {showEngagement && (
                <>
                  <th className="px-6 py-3 text-right">Temps moy.</th>
                  <th className="px-6 py-3 text-right">Scroll moy.</th>
                </>
              )}
              <th className="w-32 px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.length > 0 ? (
              rows.map((row, i) => {
                const pct = totalPageViews > 0 ? (row.count / totalPageViews) * 100 : 0;
                const barWidth = maxCount > 0 ? (row.count / maxCount) * 100 : 0;
                return (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3">
                      <span className="font-medium text-gray-900">{row.label}</span>
                      {row.sublabel && (
                        <span className="ml-2 text-xs text-gray-400">/ {row.sublabel}</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right font-medium">{row.count}</td>
                    <td className="px-6 py-3 text-right text-gray-500">{pct.toFixed(1)}%</td>
                    {showEngagement && (
                      <>
                        <td className="px-6 py-3 text-right text-gray-500">
                          {row.avgTimeOnPage != null ? `${row.avgTimeOnPage}s` : "—"}
                        </td>
                        <td className="px-6 py-3 text-right text-gray-500">
                          {row.avgScrollDepth != null ? `${row.avgScrollDepth}%` : "—"}
                        </td>
                      </>
                    )}
                    <td className="px-6 py-3">
                      <div className="h-2 w-full rounded-full bg-gray-100">
                        <div
                          className="h-2 rounded-full bg-[#2D5A3D] transition-all"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={showEngagement ? 6 : 4} className="px-6 py-10 text-center text-gray-400">
                  Pas encore de donnees pour cet onglet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
