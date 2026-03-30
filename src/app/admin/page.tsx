"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import UTMTable from "@/components/admin/UTMTable";
import ArticleSelector from "@/components/admin/ArticleSelector";
import {
  BarChart3,
  Eye,
  MousePointerClick,
  Clock,
  ArrowDown,
  Monitor,
  Smartphone,
  Tablet,
  FileText,
  TrendingUp,
  AlertCircle,
  Zap,
  Target,
  ChevronDown,
  ExternalLink,
  Mail,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

interface Brand {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
  _count: { articles: number };
}

interface AnalyticsData {
  period: { days: number; since: string };
  traffic: {
    totalPageViews: number;
    uniqueSessions: number;
    sourceBreakdown: { source: string; medium: string; count: number; avgTimeOnPage: number; avgScrollDepth: number }[];
    campaignPerformance: { campaign: string; count: number; avgTimeOnPage: number; avgScrollDepth: number }[];
    termBreakdown: { term: string; count: number; avgTimeOnPage: number; avgScrollDepth: number }[];
    contentBreakdown: { content: string; count: number; avgTimeOnPage: number; avgScrollDepth: number }[];
    topPages: { path: string; views: number; avgTimeOnPage: number; avgScrollDepth: number }[];
    dailyViews: { date: string; views: number }[];
  };
  engagement: {
    avgTimeOnPage: number;
    avgScrollDepth: number;
    avgLoadTime: number;
    bounceRate: number;
    scrollDepthBuckets: { threshold: number; count: number }[];
    webVitals: { lcp: number; fid: number; cls: number; ttfb: number; inp: number };
  };
  conversion: {
    ctaClicks: number;
    outboundCTR: number;
    topCTAs: { label: string; count: number }[];
  };
  technical: {
    avgLoadTime: number;
    deviceBreakdown: { device: string; count: number }[];
  };
  content: {
    articleStats: { status: string; count: number }[];
    recentArticles: {
      id: string;
      title: string;
      status: string;
      type: string;
      metaPixelId: string | null;
      tiktokPixelId: string | null;
      updatedAt: string;
      category: { name: string; color: string | null };
    }[];
  };
  brandsSummary: Brand[];
  newsletterCount: number;
  availableArticles: { id: string; title: string; slug: string; status: string; category: { name: string } }[];
}

const DEVICE_ICONS: Record<string, typeof Monitor> = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
};

const PIE_COLORS = ["#2D5A3D", "#3b82f6", "#f97316", "#8b5cf6", "#ec4899", "#06b6d4"];

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const [periodMode, setPeriodMode] = useState<"preset" | "custom">("preset");
  const [presetDays, setPresetDays] = useState<string>("30");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();

    if (periodMode === "custom" && dateFrom) {
      params.set("from", dateFrom);
      if (dateTo) params.set("to", dateTo);
    } else {
      params.set("days", presetDays);
    }

    if (selectedBrands.length > 0) {
      params.set("brandIds", selectedBrands.join(","));
    }

    if (selectedArticles.length > 0) {
      params.set("articleIds", selectedArticles.join(","));
    }

    fetch(`/api/analytics?${params}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [presetDays, periodMode, dateFrom, dateTo, selectedBrands, selectedArticles]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function toggleBrand(id: string) {
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  }

  const brandLabel =
    selectedBrands.length === 0
      ? "Toutes les marques"
      : selectedBrands.length === 1
      ? data?.brandsSummary?.find((b) => b.id === selectedBrands[0])?.name || "1 marque"
      : `${selectedBrands.length} marques`;

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2D5A3D] border-t-transparent" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            {selectedBrands.length > 1
              ? `Comparaison de ${selectedBrands.length} marques`
              : "Vue d'ensemble des performances"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Brand multi-selector */}
          <div className="relative">
            <button
              onClick={() => setBrandMenuOpen(!brandMenuOpen)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {selectedBrands.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2D5A3D] text-[10px] font-bold text-white">
                  {selectedBrands.length}
                </span>
              )}
              {brandLabel}
              <ChevronDown className="h-4 w-4" />
            </button>
            {brandMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setBrandMenuOpen(false)} />
                <div className="absolute right-0 z-50 mt-1 w-64 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <div className="border-b px-4 py-2">
                    <p className="text-xs font-medium text-gray-400 uppercase">Selectionner pour comparer</p>
                  </div>
                  <button
                    onClick={() => { setSelectedBrands([]); setBrandMenuOpen(false); }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${selectedBrands.length === 0 ? "font-semibold text-[#2D5A3D]" : "text-gray-700"}`}
                  >
                    Toutes les marques
                  </button>
                  {data.brandsSummary.map((b) => {
                    const isSelected = selectedBrands.includes(b.id);
                    return (
                      <button
                        key={b.id}
                        onClick={() => toggleBrand(b.id)}
                        className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50 ${isSelected ? "bg-[#2D5A3D]/5" : ""}`}
                      >
                        <span className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${isSelected ? "border-[#2D5A3D] bg-[#2D5A3D] text-white" : "border-gray-300"}`}>
                          {isSelected ? "✓" : ""}
                        </span>
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: b.color || "#999" }} />
                        {b.icon} {b.name}
                        <span className="ml-auto text-xs text-gray-400">{b._count.articles}</span>
                      </button>
                    );
                  })}
                  {selectedBrands.length > 0 && (
                    <div className="border-t px-4 py-2">
                      <button
                        onClick={() => setBrandMenuOpen(false)}
                        className="w-full rounded-md bg-[#2D5A3D] py-1.5 text-xs font-medium text-white hover:bg-[#234a31]"
                      >
                        Appliquer ({selectedBrands.length} marques)
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-2">
            <select
              value={periodMode === "custom" ? "custom" : presetDays}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "custom") {
                  setPeriodMode("custom");
                } else {
                  setPeriodMode("preset");
                  setPresetDays(v);
                }
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
            >
              <option value="7">7 jours</option>
              <option value="14">14 jours</option>
              <option value="30">30 jours</option>
              <option value="90">90 jours</option>
              <option value="all">Depuis le debut</option>
              <option value="custom">Dates personnalisees</option>
            </select>
            {periodMode === "custom" && (
              <>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
                />
                <span className="text-sm text-gray-400">→</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#2D5A3D] focus:outline-none"
                />
              </>
            )}
          </div>

          {/* Article selector */}
          {data && (
            <ArticleSelector
              articles={data.availableArticles || []}
              selectedIds={selectedArticles}
              onChange={setSelectedArticles}
            />
          )}
        </div>
      </div>

      {/* Selected brands chips */}
      {selectedBrands.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {selectedBrands.map((id) => {
            const b = data.brandsSummary.find((x) => x.id === id);
            if (!b) return null;
            return (
              <span key={id} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: b.color || "#999", color: b.color || "#999" }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: b.color || "#999" }} />
                {b.icon} {b.name}
                <button onClick={() => toggleBrand(id)} className="ml-1 hover:opacity-60">×</button>
              </span>
            );
          })}
          <button onClick={() => setSelectedBrands([])} className="text-xs text-gray-400 hover:text-gray-600">
            Tout effacer
          </button>
        </div>
      )}

      {/* KPI Cards Row 1 — Traffic */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard icon={Eye} label="Sessions" value={data.traffic.uniqueSessions} color="bg-blue-500" />
        <KpiCard icon={BarChart3} label="Pages vues" value={data.traffic.totalPageViews} color="bg-indigo-500" />
        <KpiCard icon={MousePointerClick} label="Clics CTA" value={data.conversion.ctaClicks} color="bg-green-500" />
        <KpiCard icon={Target} label="CTR sortant" value={`${data.conversion.outboundCTR}%`} color="bg-amber-500" />
      </div>

      {/* KPI Cards Row 2 — Engagement + Newsletter */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard icon={Clock} label="Temps moyen" value={`${data.engagement.avgTimeOnPage}s`} color="bg-cyan-500" />
        <KpiCard icon={ArrowDown} label="Scroll moyen" value={`${data.engagement.avgScrollDepth}%`} color="bg-purple-500" />
        <KpiCard icon={AlertCircle} label="Taux de rebond" value={`${data.engagement.bounceRate}%`} color="bg-red-500" />
        <KpiCard icon={Zap} label="LCP" value={`${data.engagement.webVitals?.lcp || 0}ms`} color="bg-emerald-500" />
        <KpiCard icon={Mail} label="Newsletter" value={data.newsletterCount} color="bg-pink-500" />
      </div>

      {/* Chart — Daily views */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-gray-900">Trafic quotidien</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.traffic.dailyViews}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip labelFormatter={(d) => new Date(d).toLocaleDateString("fr-FR")} />
              <Area type="monotone" dataKey="views" stroke="#2D5A3D" fill="#2D5A3D" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Device breakdown */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">Repartition par device</h3>
          {data.technical.deviceBreakdown.length > 0 ? (
            <div className="flex items-center gap-6">
              <div className="h-40 w-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.technical.deviceBreakdown}
                      dataKey="count"
                      nameKey="device"
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={65}
                    >
                      {data.technical.deviceBreakdown.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {data.technical.deviceBreakdown.map((d, i) => {
                  const DevIcon = DEVICE_ICONS[d.device] || Monitor;
                  const pct = data.traffic.totalPageViews > 0 ? Math.round((d.count / data.traffic.totalPageViews) * 100) : 0;
                  return (
                    <div key={d.device} className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <DevIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700 capitalize">{d.device}</span>
                      <span className="ml-auto text-sm font-semibold">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-400">Pas encore de donnees</p>
          )}
        </div>

        {/* Scroll depth */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">Profondeur de scroll</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.engagement.scrollDepthBuckets}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="threshold" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip labelFormatter={(v) => `Scroll >= ${v}%`} />
                <Bar dataKey="count" fill="#2D5A3D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Core Web Vitals */}
      {data.engagement.webVitals && (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">Core Web Vitals (Google)</h3>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <VitalCard label="LCP" value={data.engagement.webVitals.lcp} unit="ms" description="Largest Contentful Paint" good={2500} poor={4000} />
            <VitalCard label="FID" value={data.engagement.webVitals.fid} unit="ms" description="First Input Delay" good={100} poor={300} />
            <VitalCard label="CLS" value={data.engagement.webVitals.cls} unit="" description="Cumulative Layout Shift" good={0.1} poor={0.25} />
            <VitalCard label="TTFB" value={data.engagement.webVitals.ttfb} unit="ms" description="Time to First Byte" good={800} poor={1800} />
            <VitalCard label="INP" value={data.engagement.webVitals.inp} unit="ms" description="Interaction to Next Paint" good={200} poor={500} />
          </div>
        </div>
      )}

      {/* Acquisition & Conversion — UTM Table with tabs */}
      <UTMTable
        sourceData={data.traffic.sourceBreakdown}
        campaignData={data.traffic.campaignPerformance}
        termData={data.traffic.termBreakdown || []}
        contentData={data.traffic.contentBreakdown || []}
        ctaData={data.conversion.topCTAs}
        totalPageViews={data.traffic.totalPageViews}
      />

      {/* Top landing pages */}
      <div className="rounded-xl bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h3 className="font-semibold text-gray-900">Top pages</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                <th className="px-6 py-3">Page</th>
                <th className="px-6 py-3 text-right">Vues</th>
                <th className="px-6 py-3 text-right">Temps moy.</th>
                <th className="px-6 py-3 text-right">Scroll moy.</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.traffic.topPages.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{p.path}</td>
                  <td className="px-6 py-3 text-right">{p.views}</td>
                  <td className="px-6 py-3 text-right">{p.avgTimeOnPage}s</td>
                  <td className="px-6 py-3 text-right">{p.avgScrollDepth}%</td>
                </tr>
              ))}
              {data.traffic.topPages.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Pas encore de donnees</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Content management — Articles */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Article stats */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">Statut des articles</h3>
          <div className="space-y-3">
            {data.content.articleStats.map((s) => (
              <div key={s.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${s.status === "published" ? "bg-green-500" : s.status === "draft" ? "bg-amber-500" : "bg-gray-400"}`} />
                  <span className="text-sm capitalize text-gray-700">{s.status === "published" ? "En ligne" : s.status === "draft" ? "Brouillon" : s.status}</span>
                </div>
                <span className="text-sm font-semibold">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent articles with pixel status */}
        <div className="rounded-xl bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h3 className="font-semibold text-gray-900">Articles recents</h3>
            <Link href="/admin/articles" className="text-sm text-[#2D5A3D] hover:underline">
              Voir tout →
            </Link>
          </div>
          <div className="divide-y">
            {data.content.recentArticles.map((article) => (
              <Link
                key={article.id}
                href={`/admin/articles/${article.id}/edit`}
                className="flex items-center justify-between px-6 py-3 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-2 w-2 shrink-0 rounded-full ${article.status === "published" ? "bg-green-500" : "bg-amber-500"}`} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{article.title}</p>
                    <p className="text-xs text-gray-500">
                      {article.category.name} · {article.type}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {/* Pixel indicators */}
                  <div className="flex gap-1">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${article.metaPixelId ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"}`}>
                      Meta
                    </span>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${article.tiktokPixelId ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"}`}>
                      TikTok
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(article.updatedAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Brand cards — click to toggle comparison */}
      {data.brandsSummary.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Marques</h3>
            {selectedBrands.length > 0 && (
              <button onClick={() => setSelectedBrands([])} className="text-xs text-gray-400 hover:text-gray-600">
                Reinitialiser
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            {data.brandsSummary.map((brand) => {
              const isSelected = selectedBrands.includes(brand.id);
              return (
                <button
                  key={brand.id}
                  onClick={() => toggleBrand(brand.id)}
                  className={`relative flex flex-col items-center gap-2 rounded-xl border-2 bg-white p-4 text-center transition-all hover:shadow-md ${
                    isSelected ? "border-[#2D5A3D] shadow-sm" : "border-gray-200"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#2D5A3D] text-[10px] text-white">✓</span>
                  )}
                  <span className="text-2xl">{brand.icon}</span>
                  <span className="text-sm font-semibold text-gray-900">{brand.name}</span>
                  <span className="text-xs text-gray-400">{brand._count.articles} articles</span>
                  <span className="h-1 w-8 rounded-full" style={{ backgroundColor: brand.color || "#999" }} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="flex gap-4">
        <Link
          href="/admin/articles/new"
          className="rounded-lg bg-[#2D5A3D] px-6 py-3 font-medium text-white transition-colors hover:bg-[#234a31]"
        >
          + Nouvel article
        </Link>
        <Link
          href="/admin/categories"
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Gerer les marques
        </Link>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Eye;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${color} text-white`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function VitalCard({
  label,
  value,
  unit,
  description,
  good,
  poor,
}: {
  label: string;
  value: number;
  unit: string;
  description: string;
  good: number;
  poor: number;
}) {
  const status = value === 0 ? "neutral" : value <= good ? "good" : value <= poor ? "needs-improvement" : "poor";
  const statusColor = {
    good: "text-green-600 bg-green-50 border-green-200",
    "needs-improvement": "text-amber-600 bg-amber-50 border-amber-200",
    poor: "text-red-600 bg-red-50 border-red-200",
    neutral: "text-gray-400 bg-gray-50 border-gray-200",
  }[status];
  const statusLabel = {
    good: "Bon",
    "needs-improvement": "A ameliorer",
    poor: "Mauvais",
    neutral: "En attente",
  }[status];

  return (
    <div className={`rounded-xl border p-4 ${statusColor}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
        <span className="text-[10px] font-semibold rounded-full px-2 py-0.5 bg-white/60">{statusLabel}</span>
      </div>
      <p className="text-2xl font-bold">
        {value === 0 ? "—" : label === "CLS" ? value.toFixed(3) : value}
        {value !== 0 && <span className="text-sm font-normal ml-0.5">{unit}</span>}
      </p>
      <p className="mt-1 text-[11px] opacity-70">{description}</p>
    </div>
  );
}
