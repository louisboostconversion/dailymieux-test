import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/db";
import ArticleCard from "@/components/articles/ArticleCard";
import ArticleGrid from "@/components/articles/ArticleGrid";
import { formatDate } from "@/lib/utils";
import NewsletterCTA from "./NewsletterCTA";

export default async function HomePage() {
  const featuredArticle = await prisma.article.findFirst({
    where: { featured: true, status: "published" },
    include: { category: true, author: true },
    orderBy: { publishedAt: "desc" },
  });

  const latestArticles = await prisma.article.findMany({
    where: { status: "published", featured: false },
    include: { category: true, author: true },
    orderBy: { publishedAt: "desc" },
    take: 9,
  });

  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { articles: { where: { status: "published" } } } },
      articles: {
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
        take: 1,
        select: { coverImage: true },
      },
    },
    orderBy: { order: "asc" },
  });

  const heroSide = latestArticles.slice(0, 2);
  const trendingArticles = latestArticles.slice(2, 6);
  const moreArticles = latestArticles.slice(6, 9);

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="bg-bg-secondary pb-2 pt-6 md:pb-4 md:pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main featured — full width */}
          {featuredArticle && (
            <Link
              href={`/${featuredArticle.category.slug}/${featuredArticle.slug}`}
              className="group relative block overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-[21/9] w-full md:aspect-[21/9]">
                {featuredArticle.coverImage ? (
                  <Image
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    priority
                    sizes="100vw"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-navy to-blue" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5 md:p-10">
                <span
                  className="mb-3 inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white"
                  style={{ backgroundColor: featuredArticle.category.color || "var(--blue)" }}
                >
                  {featuredArticle.category.name}
                </span>
                <h1 className="mb-2 max-w-2xl font-[family-name:var(--font-heading)] text-2xl font-bold leading-tight text-white md:text-5xl">
                  {featuredArticle.title}
                </h1>
                <p className="mb-4 hidden max-w-xl text-base text-white/60 md:block">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-white/40">
                  <span>{featuredArticle.author.name}</span>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  {featuredArticle.publishedAt && (
                    <time>{formatDate(featuredArticle.publishedAt)}</time>
                  )}
                </div>
              </div>
            </Link>
          )}

          {/* 2 articles below hero */}
          {heroSide.length > 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 md:mt-5 md:gap-5">
              {heroSide.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════ RUBRIQUES ═══════ */}
      {categories.length > 0 && (
        <section className="bg-bg-secondary pb-8 pt-10 md:pb-12 md:pt-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-navy md:text-2xl">
                Nos rubriques
              </h2>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none md:grid md:grid-cols-7 md:overflow-visible md:pb-0">
              {categories.map((category) => {
                const coverImg = category.articles[0]?.coverImage;
                return (
                  <Link
                    key={category.slug}
                    href={`/${category.slug}`}
                    className="group relative flex-shrink-0 overflow-hidden rounded-2xl md:flex-shrink"
                    style={{ minWidth: "130px" }}
                  >
                    {/* Background image or gradient */}
                    <div className="relative aspect-[3/4] w-full md:aspect-[4/5]">
                      {coverImg ? (
                        <Image
                          src={coverImg}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 130px, 14vw"
                        />
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{
                            background: `linear-gradient(135deg, ${category.color || "#416CC2"}, ${category.color || "#416CC2"}88)`,
                          }}
                        />
                      )}
                      <div
                        className="absolute inset-0 opacity-70 transition-opacity group-hover:opacity-80"
                        style={{
                          background: `linear-gradient(to top, ${category.color || "#0B1956"}ee 0%, ${category.color || "#0B1956"}40 50%, transparent 100%)`,
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                      <span className="mb-1 block text-xl md:text-2xl">{category.icon}</span>
                      <h3 className="text-sm font-bold text-white md:text-base">
                        {category.name}
                      </h3>
                      <span className="text-[10px] text-white/50">
                        {category._count.articles} article{category._count.articles !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ TENDANCES ═══════ */}
      {trendingArticles.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-pale">
              <TrendingUp className="h-4 w-4 text-blue" />
            </div>
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-navy md:text-2xl">
              Tendances
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trendingArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* ═══════ MORE ARTICLES ═══════ */}
      {moreArticles.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 md:pb-16 lg:px-8">
          <ArticleGrid articles={moreArticles} title="Articles récents" />
        </section>
      )}

      {/* ═══════ NEWSLETTER ═══════ */}
      <NewsletterCTA />
    </>
  );
}
