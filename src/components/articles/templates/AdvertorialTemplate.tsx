"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Eye, Calendar, User, Sparkles } from "lucide-react";
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
  description: string;
  price?: string;
  ctaLabel: string;
  ctaUrl: string;
}

interface ContentData {
  sections: { title: string; body: string }[];
  products: Product[];
  verdict: string;
}

export function AdvertorialTemplate({ article }: ArticleProps) {
  const raw = JSON.parse(article.content);
  const data: ContentData = {
    sections: raw.sections || [],
    products: raw.products || [],
    verdict: raw.verdict || "",
  };

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
          <div className="mx-auto w-full max-w-4xl px-4 pb-10 md:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide mb-4"
                style={{
                  backgroundColor: article.category.color || "#3b82f6",
                  color: "#fff",
                }}
              >
                {article.category.name}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                {article.title}
              </h1>
              <p className="text-lg md:text-xl text-white/85 max-w-2xl">
                {article.excerpt}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Author & Meta */}
      <div className="mx-auto max-w-4xl px-4 py-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 border-b border-gray-100">
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

      {/* Content Sections */}
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-10">
        {data.sections.map((section, i) => (
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

      {/* Products */}
      {data.products.length > 0 && (
        <div className="bg-gray-50 py-12">
          <div className="mx-auto max-w-4xl px-4 space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
              Produits recommand&eacute;s
            </h2>
            {data.products.map((product, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row gap-6 bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
              >
                {product.image && (
                  <div className="relative w-full md:w-64 aspect-square md:aspect-auto shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center p-6 gap-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {product.price && (
                      <span className="inline-block rounded-full bg-gray-100 px-4 py-1.5 text-sm font-semibold text-gray-800">
                        {product.price}
                      </span>
                    )}
                    <a
                      href={product.ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue/80 transition-colors"
                    >
                      {product.ctaLabel}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Verdict */}
      {data.verdict && (
        <div className="mx-auto max-w-4xl px-4 py-12">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="border-l-4 border-blue bg-blue-light rounded-r-xl p-6 md:p-8"
          >
            <h3 className="text-lg font-bold text-navy mb-3">
              Notre verdict
            </h3>
            <p className="text-navy italic leading-relaxed text-lg">
              {data.verdict}
            </p>
          </motion.div>
        </div>
      )}

      {/* Final CTA */}
      {article.ctaLabel && article.ctaUrl && (
        <div className="mx-auto max-w-4xl px-4 pb-16 text-center">
          <a
            href={article.ctaUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-3 rounded-full bg-blue px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-blue/80 hover:shadow-xl transition-all"
          >
            {article.ctaLabel}
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      )}
    </article>
  );
}

export default AdvertorialTemplate;
