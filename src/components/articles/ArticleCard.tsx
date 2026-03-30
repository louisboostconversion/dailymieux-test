"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { Clock } from "lucide-react";

interface ArticleCardProps {
  article: {
    title: string;
    slug: string;
    excerpt: string;
    type: string;
    coverImage: string | null;
    readTime: number | null;
    category: {
      name: string;
      slug: string;
      color: string | null;
    };
    author: {
      name: string;
    };
    publishedAt: Date | null;
    sponsorName: string | null;
  };
  variant?: "default" | "horizontal" | "featured";
}

export default function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const href = `/${article.category.slug}/${article.slug}`;

  if (variant === "horizontal") {
    return (
      <Link href={href}>
        <motion.article
          whileHover={{ y: -2 }}
          transition={{ type: "tween", duration: 0.2 }}
          className="group flex gap-4 rounded-2xl bg-white p-3 transition-shadow hover:shadow-[0_4px_20px_rgba(11,25,86,0.08)]"
        >
          {/* Image */}
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
            {article.coverImage ? (
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="96px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-blue-pale">
                <span className="text-lg text-blue">✦</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-center">
            <span
              className="mb-1 text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: article.category.color || "var(--blue)" }}
            >
              {article.category.name}
            </span>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-navy transition-colors group-hover:text-blue">
              {article.title}
            </h3>
            {article.publishedAt && (
              <time className="mt-1.5 text-[11px] text-text-muted">
                {formatDate(article.publishedAt)}
              </time>
            )}
          </div>
        </motion.article>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={href}>
        <motion.article
          whileHover={{ y: -3 }}
          transition={{ type: "tween", duration: 0.25 }}
          className="group relative h-full overflow-hidden rounded-2xl bg-navy"
        >
          {/* Image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            {article.coverImage ? (
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 66vw"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy to-blue">
                <span className="text-4xl text-white/20">✦</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
          </div>

          {/* Content overlay */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <span
              className="mb-3 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white"
              style={{ backgroundColor: article.category.color || "var(--blue)" }}
            >
              {article.category.name}
            </span>
            <h2 className="mb-2 font-[family-name:var(--font-heading)] text-2xl font-bold leading-tight text-white md:text-3xl">
              {article.title}
            </h2>
            <p className="mb-4 line-clamp-2 max-w-lg text-sm text-white/70">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-3 text-xs text-white/50">
              <span>{article.author.name}</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              {article.publishedAt && (
                <time>{formatDate(article.publishedAt)}</time>
              )}
              {article.readTime && (
                <>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readTime} min
                  </span>
                </>
              )}
            </div>
          </div>
        </motion.article>
      </Link>
    );
  }

  // Default card
  return (
    <Link href={href}>
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ type: "tween", duration: 0.25 }}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-transparent bg-white transition-all duration-300 hover:border-border hover:shadow-[0_8px_30px_rgba(11,25,86,0.07)]"
      >
        {/* Cover image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-pale to-blue-light">
              <div className="text-3xl text-blue/20">✦</div>
            </div>
          )}

          {/* Category pill - top left */}
          <div className="absolute left-3 top-3">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm"
              style={{ backgroundColor: (article.category.color || "var(--blue)") + "dd" }}
            >
              {article.category.name}
            </span>
          </div>

          {/* Read time pill - bottom right */}
          {article.readTime && (
            <div className="absolute bottom-3 right-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-navy shadow-sm backdrop-blur-sm">
                <Clock className="h-3 w-3" />
                {article.readTime} min
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="mb-2 font-[family-name:var(--font-heading)] text-[17px] font-bold leading-snug text-navy transition-colors group-hover:text-blue">
            {article.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-[13px] leading-relaxed text-text-secondary">
            {article.excerpt}
          </p>

          {/* Bottom meta */}
          <div className="mt-auto flex items-center gap-2 border-t border-border/50 pt-3">
            {/* Author avatar placeholder */}
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-pale text-[10px] font-bold text-blue">
              {article.author.name.charAt(0)}
            </div>
            <span className="text-[12px] font-medium text-text-secondary">
              {article.author.name}
            </span>
            <span className="ml-auto text-[11px] text-text-muted">
              {article.publishedAt && formatDate(article.publishedAt)}
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
