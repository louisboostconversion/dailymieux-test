import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (type) where.type = type;
  if (categoryId) where.categoryId = categoryId;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
    ];
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true, color: true } },
        author: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  return NextResponse.json({
    articles,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    title,
    excerpt,
    content,
    type,
    status,
    coverImage,
    categoryId,
    authorId,
    seoTitle,
    seoDesc,
    ogImage,
    featured,
    sponsorName,
    sponsorLogo,
    sponsorUrl,
    ctaLabel,
    ctaUrl,
  } = body;

  if (!title || !excerpt || !content || !categoryId || !authorId) {
    return NextResponse.json(
      { error: "Title, excerpt, content, categoryId, and authorId are required" },
      { status: 400 }
    );
  }

  const slug = slugify(title);

  // Check for duplicate slug
  const existing = await prisma.article.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const article = await prisma.article.create({
    data: {
      title,
      slug: finalSlug,
      excerpt,
      content: typeof content === "string" ? content : JSON.stringify(content),
      type: type || "guide",
      status: status || "draft",
      coverImage,
      categoryId,
      authorId,
      seoTitle,
      seoDesc,
      ogImage,
      featured: featured || false,
      sponsorName,
      sponsorLogo,
      sponsorUrl,
      ctaLabel,
      ctaUrl,
      publishedAt: status === "published" ? new Date() : null,
    },
    include: {
      category: true,
      author: true,
    },
  });

  return NextResponse.json(article, { status: 201 });
}
