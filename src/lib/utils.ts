import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export const articleTypeLabels: Record<string, string> = {
  advertorial: "Advertorial",
  comparative: "Comparatif",
  listicle: "Listicle",
  review: "Review",
  guide: "Guide",
};

export const articleTypeColors: Record<string, string> = {
  advertorial: "bg-amber-100 text-amber-800",
  comparative: "bg-blue-100 text-blue-800",
  listicle: "bg-purple-100 text-purple-800",
  review: "bg-green-100 text-green-800",
  guide: "bg-rose-100 text-rose-800",
};

export const TOPICS: Record<string, { name: string; color: string }> = {
  regime: { name: "Régime", color: "#22c55e" },
  alimentation: { name: "Alimentation", color: "#f97316" },
  sante: { name: "Santé", color: "#10b981" },
  maison: { name: "Maison", color: "#8b5cf6" },
  conso: { name: "Consommation", color: "#3b82f6" },
  lifestyle: { name: "Lifestyle", color: "#6b7280" },
};

export function getTopicDisplay(topic?: string | null): { name: string; color: string } {
  if (topic && TOPICS[topic]) return TOPICS[topic];
  return { name: topic || "Article", color: "#416CC2" };
}

export function safeParseJSON<T = Record<string, unknown>>(
  raw: string,
  fallback: T = {} as T
): T {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return fallback;
    return parsed as T;
  } catch {
    console.error("Failed to parse article content as JSON");
    return fallback;
  }
}
