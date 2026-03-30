"use client";

import Image from "next/image";
import { formatDate } from "@/lib/utils";
import {
  Check,
  X,
  Trophy,
  Eye,
  Calendar,
  User,
  Star,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

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

interface ContentData {
  criteria: string[];
  products: Product[];
  winner: string;
  verdict: string;
}

function getRatingColor(score: number): string {
  if (score >= 4) return "bg-green-500";
  if (score >= 3) return "bg-yellow-500";
  return "bg-red-500";
}

function getBadgeStyle(badge: string): string {
  const lower = badge.toLowerCase();
  if (lower.includes("meilleur choix"))
    return "bg-blue-light text-navy border-blue";
  if (lower.includes("rapport"))
    return "bg-blue-100 text-blue-800 border-blue-200";
  return "bg-purple-100 text-purple-800 border-purple-200";
}

function averageRating(ratings: Record<string, number>): number {
  const values = Object.values(ratings);
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function ComparativeTemplate({ article }: ArticleProps) {
  const raw = JSON.parse(article.content);
  const data: ContentData = {
    criteria: raw.criteria || [],
    products: raw.products || [],
    winner: raw.winner || "",
    verdict: raw.verdict || "",
  };
  const sections: { title: string; body: string }[] = raw.sections || [];

  return (
    <article className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative w-full aspect-[21/9] min-h-[300px] max-h-[480px]">
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
          <div className="mx-auto w-full max-w-5xl px-4 pb-10 md:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white mb-4">
                Comparatif
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
      <div className="mx-auto max-w-5xl px-4 py-5 flex flex-wrap items-center gap-4 text-sm text-gray-500 border-b border-gray-100">
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

      {/* Editorial sections */}
      {sections.length > 0 && (
        <div className="mx-auto max-w-4xl px-4 py-10 space-y-10">
          {sections.map((section, i) => (
            <motion.section
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
              <div
                className="prose prose-lg prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: section.body.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }}
              />
            </motion.section>
          ))}
        </div>
      )}

      {/* Product Cards */}
      {data.products.length > 0 && (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.products.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden flex flex-col"
            >
              {/* Product Image */}
              {product.image && (
                <div className="relative w-full aspect-[4/3] bg-gray-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                  />
                  {product.badge && (
                    <span
                      className={`absolute top-3 left-3 rounded-full border px-3 py-1 text-xs font-semibold ${getBadgeStyle(product.badge)}`}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>
              )}
              {!product.image && product.badge && (
                <div className="px-4 pt-4">
                  <span
                    className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${getBadgeStyle(product.badge)}`}
                  >
                    {product.badge}
                  </span>
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-gray-700">
                      {averageRating(product.ratings).toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Ratings */}
                <div className="space-y-2.5 mb-5">
                  {data.criteria.map((criterion) => (
                    <div key={criterion}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">{criterion}</span>
                        <span className="font-semibold text-gray-800">
                          {product.ratings[criterion] ?? 0}/5
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getRatingColor(product.ratings[criterion] ?? 0)}`}
                          style={{
                            width: `${((product.ratings[criterion] ?? 0) / 5) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pros */}
                {product.pros.length > 0 && (
                  <div className="mb-3">
                    <ul className="space-y-1">
                      {product.pros.map((pro, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cons */}
                {product.cons.length > 0 && (
                  <div className="mb-4">
                    <ul className="space-y-1">
                      {product.cons.map((con, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                  {product.price && (
                    <span className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-bold text-gray-900">
                      {product.price}
                    </span>
                  )}
                  {product.ctaUrl && (
                    <a
                      href={product.ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Voir l&apos;offre
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      )}

      {/* Comparison Table */}
      {data.criteria.length > 0 && data.products.length > 0 && (
      <div className="bg-gray-50 py-12">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Tableau comparatif
          </h2>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full min-w-[600px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                    Crit&egrave;re
                  </th>
                  {data.products.map((product, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b border-gray-200"
                    >
                      {product.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.criteria.map((criterion, ci) => (
                  <tr
                    key={ci}
                    className={ci % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  >
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium border-b border-gray-100">
                      {criterion}
                    </td>
                    {data.products.map((product, pi) => {
                      const score = product.ratings[criterion] ?? 0;
                      return (
                        <td
                          key={pi}
                          className="px-4 py-3 text-center border-b border-gray-100"
                        >
                          <span
                            className={`inline-block rounded-full px-3 py-0.5 text-sm font-bold text-white ${getRatingColor(score)}`}
                          >
                            {score}/5
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="bg-blue-50/50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-bold">
                    Moyenne
                  </td>
                  {data.products.map((product, pi) => (
                    <td
                      key={pi}
                      className="px-4 py-3 text-center text-lg font-bold text-gray-900"
                    >
                      {averageRating(product.ratings).toFixed(1)}
                    </td>
                  ))}
                </tr>
                {data.products.some((p) => p.price) && (
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                      Prix
                    </td>
                    {data.products.map((product, pi) => (
                      <td
                        key={pi}
                        className="px-4 py-3 text-center text-sm font-semibold text-gray-900"
                      >
                        {product.price || "—"}
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* Winner */}
      {data.winner && (
        <div className="mx-auto max-w-5xl px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-8 md:p-10 text-center"
          >
            <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Notre gagnant
            </h2>
            <p className="text-xl md:text-2xl font-bold text-yellow-700">
              {data.winner}
            </p>
          </motion.div>
        </div>
      )}

      {/* Verdict */}
      {data.verdict && (
        <div className="mx-auto max-w-4xl px-4 pb-16">
          <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-xl p-6 md:p-8">
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              Notre verdict
            </h3>
            <p className="text-blue-800 leading-relaxed text-lg">
              {data.verdict}
            </p>
          </div>
        </div>
      )}

      {/* Sponsor */}
      {article.sponsorName && (
        <div className="mx-auto max-w-5xl px-4 pb-12">
          <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
            <span>En partenariat avec</span>
            {article.sponsorLogo && (
              <Image
                src={article.sponsorLogo}
                alt={article.sponsorName}
                width={80}
                height={24}
                className="h-5 w-auto object-contain opacity-60"
              />
            )}
            <span className="font-medium">{article.sponsorName}</span>
          </div>
        </div>
      )}
    </article>
  );
}

export default ComparativeTemplate;
