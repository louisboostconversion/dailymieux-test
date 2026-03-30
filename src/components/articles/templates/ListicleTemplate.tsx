"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import {
  ArrowRight,
  Eye,
  Calendar,
  User,
  List,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ArticleProps {
  article: {
    title: string;
    excerpt: string;
    content: string;
    type: string;
    coverImage: string | null;
    category: { name: string; slug: string; color: string | null };
    author: { name: string; avatar: string | null };
    publishedAt: Date | null;
    sponsorName: string | null;
    sponsorLogo: string | null;
    sponsorUrl: string | null;
    ctaLabel: string | null;
    ctaUrl: string | null;
    views: number;
  };
}

interface ListItem {
  title: string;
  body: string;
  image?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

interface ContentData {
  items: ListItem[];
}

export function ListicleTemplate({ article }: ArticleProps) {
  const raw = JSON.parse(article.content);
  // Support both "items" (native listicle) and "sections" (fallback from editorial content)
  const rawItems = raw.items || (raw.sections || []).map((s: { title: string; body: string; image?: string; ctaLabel?: string; ctaUrl?: string }) => ({
    title: s.title,
    body: s.body,
    image: s.image,
    ctaLabel: s.ctaLabel,
    ctaUrl: s.ctaUrl,
  }));
  const data: ContentData = {
    items: rawItems,
  };
  const [tocOpen, setTocOpen] = useState(false);

  const handleScrollTo = (index: number) => {
    const el = document.getElementById(`item-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTocOpen(false);
    }
  };

  return (
    <article className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative w-full aspect-[21/9] min-h-[280px] max-h-[480px]">
        {article.coverImage && (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="mx-auto w-full max-w-4xl px-4 pb-10 md:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide mb-4"
                style={{
                  backgroundColor: article.category.color || "#8b5cf6",
                  color: "#fff",
                }}
              >
                {article.category.name}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3">
                {article.title}
              </h1>
              <p className="text-lg text-white/80 max-w-2xl">
                {article.excerpt}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Author & Meta */}
      <div className="mx-auto max-w-4xl px-4 py-5 flex flex-wrap items-center gap-4 text-sm text-gray-500 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {article.author.avatar ? (
            <Image
              src={article.author.avatar}
              alt={article.author.name}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-400" />
            </div>
          )}
          <span className="font-medium text-gray-700">{article.author.name}</span>
        </div>
        {article.publishedAt && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Eye className="h-4 w-4" />
          <span>{article.views.toLocaleString("fr-FR")} vues</span>
        </div>
      </div>

      {/* Layout with TOC */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex gap-10">
          {/* Desktop TOC */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                <List className="h-4 w-4" />
                <span>Sommaire</span>
              </div>
              <nav className="space-y-1">
                {data.items.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleScrollTo(i)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-3"
                  >
                    <span className="text-xs font-bold text-gray-400 w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="line-clamp-2">{item.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile TOC */}
          <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setTocOpen(!tocOpen)}
                className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-gray-700"
              >
                <span className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  Sommaire ({data.items.length} &eacute;l&eacute;ments)
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${tocOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {tocOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <nav className="px-3 pb-3 max-h-60 overflow-y-auto space-y-0.5">
                      {data.items.map((item, i) => (
                        <button
                          key={i}
                          onClick={() => handleScrollTo(i)}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-3"
                        >
                          <span className="text-xs font-bold text-gray-400 w-6">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="line-clamp-1">{item.title}</span>
                        </button>
                      ))}
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 min-w-0 space-y-16">
            {data.items.map((item, i) => (
              <motion.section
                key={i}
                id={`item-${i}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4 }}
                className="scroll-mt-24"
              >
                <div className="relative mb-6">
                  <span className="absolute -left-2 -top-8 text-8xl md:text-9xl font-black text-gray-100 select-none leading-none pointer-events-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="relative text-2xl md:text-3xl font-bold text-gray-900 pt-4 pl-1">
                    {item.title}
                  </h2>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {item.image && (
                    <div className="relative w-full aspect-[16/9]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 md:p-8">
                    <div
                      className="prose prose-gray max-w-none"
                      dangerouslySetInnerHTML={{ __html: item.body }}
                    />
                    {item.ctaLabel && item.ctaUrl && (
                      <div className="mt-6">
                        <a
                          href={item.ctaUrl}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                        >
                          {item.ctaLabel}
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      {article.ctaLabel && article.ctaUrl && (
        <div className="mx-auto max-w-4xl px-4 pb-20 lg:pb-16 text-center">
          <a
            href={article.ctaUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-3 rounded-full bg-gray-900 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all"
          >
            {article.ctaLabel}
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      )}
    </article>
  );
}

export default ListicleTemplate;
