import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import AdvertorialTemplate from "@/components/articles/templates/AdvertorialTemplate";
import ComparativeTemplate from "@/components/articles/templates/ComparativeTemplate";
import ListicleTemplate from "@/components/articles/templates/ListicleTemplate";
import ReviewTemplate from "@/components/articles/templates/ReviewTemplate";
import GuideTemplate from "@/components/articles/templates/GuideTemplate";
import StickyCTA from "@/components/articles/StickyCTA";

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    where: { status: "published" },
    include: { category: true },
  });
  return articles.map((a) => ({
    category: a.category.slug,
    slug: a.slug,
  }));
}

interface ArticlePageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!article) {
    return { title: "Article introuvable" };
  }

  return {
    title: article.seoTitle || `${article.title} | Daily Mieux`,
    description: article.seoDesc || article.excerpt,
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDesc || article.excerpt,
      images: article.ogImage || article.coverImage
        ? [{ url: (article.ogImage || article.coverImage)! }]
        : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      author: true,
    },
  });

  if (!article || article.status !== "published") {
    notFound();
  }

  // Determine template
  let template;
  switch (article.type) {
    case "advertorial":
      template = <AdvertorialTemplate article={article} />;
      break;
    case "comparative":
      template = <ComparativeTemplate article={article} />;
      break;
    case "listicle":
      template = <ListicleTemplate article={article} />;
      break;
    case "review":
      template = <ReviewTemplate article={article} />;
      break;
    case "guide":
    default:
      template = <GuideTemplate article={article} />;
      break;
  }

  // Show sticky CTA if article has a CTA configured
  const hasStickyCTA = article.ctaLabel && article.ctaUrl;

  return (
    <>
      {template}
      {hasStickyCTA && (
        <StickyCTA
          label={article.ctaLabel!}
          url={article.ctaUrl!}
          sponsorName={article.sponsorName}
        />
      )}
    </>
  );
}
