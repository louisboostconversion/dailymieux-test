import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ArticleCard from "./ArticleCard";

interface ArticleGridArticle {
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
}

interface ArticleGridProps {
  articles: ArticleGridArticle[];
  title?: string;
  viewAll?: string;
}

export default function ArticleGrid({ articles, title, viewAll }: ArticleGridProps) {
  return (
    <section>
      {(title || viewAll) && (
        <div className="mb-8 flex items-center justify-between">
          {title && (
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-navy md:text-2xl">
              {title}
            </h2>
          )}
          {viewAll && (
            <Link
              href={viewAll}
              className="flex items-center gap-1.5 text-sm font-medium text-blue transition-colors hover:text-navy"
            >
              Voir tout
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
