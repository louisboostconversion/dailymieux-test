import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ArticleGrid from "@/components/articles/ArticleGrid";

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });
  return categories.map((c) => ({ category: c.slug }));
}

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    return { title: "Catégorie introuvable" };
  }

  return {
    title: `${category.name} | Daily Mieux`,
    description:
      category.description ||
      `Découvrez nos articles dans la catégorie ${category.name}.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    notFound();
  }

  const articles = await prisma.article.findMany({
    where: {
      categoryId: category.id,
      status: "published",
    },
    include: {
      category: true,
      author: true,
    },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      {/* Category header */}
      <section className="relative overflow-hidden border-b border-border bg-bg-secondary py-12 md:py-16">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cat-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cat-grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {category.icon && (
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl md:h-16 md:w-16 md:text-3xl"
                style={{
                  backgroundColor: (category.color || "#416CC2") + "15",
                }}
              >
                {category.icon}
              </div>
            )}
            <div>
              <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-navy md:text-4xl">
                {category.name}
              </h1>
              {category.description && (
                <p className="mt-1.5 max-w-2xl text-sm text-text-secondary">
                  {category.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <span className="text-sm text-text-muted">
              {articles.length} article{articles.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        {articles.length > 0 ? (
          <ArticleGrid articles={articles} />
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-text-muted">
              Aucun article dans cette cat&eacute;gorie pour le moment.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
