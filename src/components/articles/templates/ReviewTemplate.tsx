"use client";

import Image from "next/image";
import { formatDate } from "@/lib/utils";
import {
  Check,
  X,
  Eye,
  Calendar,
  User,
  UserCheck,
  ArrowRight,
  Sparkles,
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

interface ContentData {
  overallScore: number;
  criteria: { name: string; score: number }[];
  pros: string[];
  cons: string[];
  forWho: string;
  alternatives: { name: string; url?: string }[];
  body: string;
}

function getScoreColor(score: number): string {
  if (score > 7) return "text-green-600";
  if (score > 5) return "text-yellow-600";
  return "text-red-600";
}

function getBarColor(score: number): string {
  if (score > 7) return "bg-green-500";
  if (score > 5) return "bg-yellow-500";
  return "bg-red-500";
}

function getCircleColor(score: number): string {
  if (score > 7) return "border-green-500 text-green-600";
  if (score > 5) return "border-yellow-500 text-yellow-600";
  return "border-red-500 text-red-600";
}

export function ReviewTemplate({ article }: ArticleProps) {
  const raw = JSON.parse(article.content);
  const hasSectionsOnly = !raw.overallScore && !raw.criteria && raw.sections;
  const data: ContentData = {
    overallScore: raw.overallScore || 0,
    criteria: raw.criteria || [],
    pros: raw.pros || [],
    cons: raw.cons || [],
    forWho: raw.forWho || "",
    alternatives: raw.alternatives || [],
    body: raw.body || "",
  };
  // Fallback sections for editorial-style reviews
  const fallbackSections: { title: string; body: string }[] = hasSectionsOnly ? raw.sections : [];

  return (
    <article className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative w-full aspect-[21/9] min-h-[320px] max-h-[520px]">
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
          <div className="mx-auto w-full max-w-4xl px-4 pb-16 md:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide mb-4"
                style={{
                  backgroundColor: article.category.color || "#ef4444",
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

        {/* Score Circle overlapping hero */}
        {data.overallScore > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute -bottom-12 right-4 md:right-8 lg:right-auto lg:left-1/2 lg:-translate-x-1/2"
        >
          <div
            className={`w-24 h-24 md:w-28 md:h-28 rounded-full bg-white shadow-xl border-4 flex flex-col items-center justify-center ${getCircleColor(data.overallScore)}`}
          >
            <span className="text-3xl md:text-4xl font-black leading-none">
              {data.overallScore}
            </span>
            <span className="text-xs font-medium text-gray-400">/10</span>
          </div>
        </motion.div>
        )}
      </div>

      {/* Author & Meta */}
      <div className={`mx-auto max-w-4xl px-4 ${data.overallScore > 0 ? 'pt-16' : 'pt-5'} pb-5 flex flex-wrap items-center gap-4 text-sm text-gray-500 border-b border-gray-100`}>
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

      {/* Fallback: editorial sections when no structured review data */}
      {fallbackSections.length > 0 && (
        <div className="mx-auto max-w-4xl px-4 py-10 space-y-10">
          {fallbackSections.map((section, i) => (
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
                dangerouslySetInnerHTML={{ __html: section.body }}
              />
            </motion.section>
          ))}
        </div>
      )}

      {/* Score Breakdown */}
      {data.criteria.length > 0 && (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          &Eacute;valuation d&eacute;taill&eacute;e
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.criteria.map((criterion, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-gray-50 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {criterion.name}
                </span>
                <span
                  className={`text-lg font-bold ${getScoreColor(criterion.score)}`}
                >
                  {criterion.score}/10
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(criterion.score / 10) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className={`h-full rounded-full ${getBarColor(criterion.score)}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      )}

      {/* Pros & Cons */}
      {(data.pros.length > 0 || data.cons.length > 0) && (
      <div className="mx-auto max-w-4xl px-4 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pros */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-blue-pale rounded-2xl p-6 border border-blue/20"
          >
            <h3 className="flex items-center gap-2 text-lg font-bold text-navy mb-4">
              <Check className="h-5 w-5 text-blue" />
              Points forts
            </h3>
            <ul className="space-y-2.5">
              {data.pros.map((pro, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-navy"
                >
                  <Check className="h-4 w-4 text-blue shrink-0 mt-0.5" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Cons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-red-50 rounded-2xl p-6 border border-red-100"
          >
            <h3 className="flex items-center gap-2 text-lg font-bold text-red-900 mb-4">
              <X className="h-5 w-5 text-red-600" />
              Points faibles
            </h3>
            <ul className="space-y-2.5">
              {data.cons.map((con, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-red-800"
                >
                  <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
      )}

      {/* For Who */}
      {data.forWho && (
        <div className="mx-auto max-w-4xl px-4 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-blue-50 rounded-2xl p-6 md:p-8 border border-blue-100"
          >
            <h3 className="flex items-center gap-2 text-lg font-bold text-blue-900 mb-3">
              <UserCheck className="h-5 w-5 text-blue-600" />
              Pour qui ?
            </h3>
            <p className="text-blue-800 leading-relaxed">{data.forWho}</p>
          </motion.div>
        </div>
      )}

      {/* Body */}
      {data.body && (
        <div className="mx-auto max-w-4xl px-4 pb-10">
          <div
            className="prose prose-lg prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: data.body }}
          />
        </div>
      )}

      {/* Alternatives */}
      {data.alternatives.length > 0 && (
        <div className="bg-gray-50 py-10">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Alternatives &agrave; consid&eacute;rer
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data.alternatives.map((alt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  {alt.url ? (
                    <a
                      href={alt.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="flex items-center justify-between gap-2 bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group"
                    >
                      <span className="font-medium text-gray-800 group-hover:text-gray-900">
                        {alt.name}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 shrink-0" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <span className="font-medium text-gray-800">
                        {alt.name}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sponsor */}
      {article.sponsorName && (
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="flex items-center justify-center gap-3 rounded-xl bg-gray-50 px-5 py-3 text-sm text-gray-500">
            <Sparkles className="h-4 w-4" />
            <span>Article sponsoris&eacute; par</span>
            {article.sponsorLogo && (
              <Image
                src={article.sponsorLogo}
                alt={article.sponsorName}
                width={80}
                height={24}
                className="h-5 w-auto object-contain"
              />
            )}
            {article.sponsorUrl ? (
              <a
                href={article.sponsorUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="font-semibold text-gray-700 underline underline-offset-2 hover:text-gray-900"
              >
                {article.sponsorName}
              </a>
            ) : (
              <span className="font-semibold text-gray-700">
                {article.sponsorName}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Final CTA */}
      {article.ctaLabel && article.ctaUrl && (
        <div className="mx-auto max-w-4xl px-4 pb-16 text-center">
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

export default ReviewTemplate;
