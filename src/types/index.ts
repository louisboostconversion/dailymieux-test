export type ArticleType = "advertorial" | "comparative" | "listicle" | "review" | "guide";
export type ArticleStatus = "draft" | "published";

export interface ArticleWithRelations {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  type: string;
  status: string;
  coverImage: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
  };
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
  seoTitle: string | null;
  seoDesc: string | null;
  ogImage: string | null;
  featured: boolean;
  views: number;
  sponsorName: string | null;
  sponsorLogo: string | null;
  sponsorUrl: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Content structure for different article types
export interface AdvertorialContent {
  sections: { title: string; body: string }[];
  products: {
    name: string;
    image?: string;
    description: string;
    price?: string;
    ctaLabel: string;
    ctaUrl: string;
  }[];
  verdict: string;
}

export interface ComparativeContent {
  criteria: string[];
  products: {
    name: string;
    image?: string;
    ratings: Record<string, number>;
    pros: string[];
    cons: string[];
    price?: string;
    ctaUrl?: string;
    badge?: string;
  }[];
  winner: string;
  verdict: string;
}

export interface ListicleContent {
  items: {
    title: string;
    body: string;
    image?: string;
    ctaLabel?: string;
    ctaUrl?: string;
  }[];
}

export interface ReviewContent {
  overallScore: number;
  criteria: { name: string; score: number }[];
  pros: string[];
  cons: string[];
  forWho: string;
  alternatives: { name: string; url?: string }[];
  body: string;
}

export interface GuideContent {
  sections: { id: string; title: string; body: string }[];
  tips: { title: string; body: string }[];
  faq: { question: string; answer: string }[];
}
