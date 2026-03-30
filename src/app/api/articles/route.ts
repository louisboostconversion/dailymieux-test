import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";
import { requireAuth, isAuthError } from "@/lib/auth";
import { validateArticleCreate } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20") || 20));

  // Check if the requester is an authenticated admin
  const auth = await requireAuth(request);
  const isAdmin = !isAuthError(auth);

  const where: Record<string, unknown> = {};

  if (isAdmin) {
    // Admins can filter by any status
    const status = searchParams.get("status");
    if (status) where.status = status;
  } else {
    // Public visitors only see published articles
    where.status = "published";
  }

  if (type) where.type = type;
  if (categoryId) where.categoryId = categoryId;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
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
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const body = await request.json();
  const validationError = validateArticleCreate(body);
  if (validationError) return validationError;

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

  const slug = slugify(title);

  // Check for duplicate slug
  const existing = await prisma.article.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  // Auto-calculate read time
  const contentStr = typeof content === "string" ? content : JSON.stringify(content);
  const wordCount = contentStr.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  const article = await prisma.article.create({
    data: {
      title,
      slug: finalSlug,
      excerpt,
      content: contentStr,
      type: type || "guide",
      topic: body.topic || "lifestyle",
      status: status || "draft",
      coverImage,
      categoryId,
      authorId,
      readTime,
      seoTitle,
      seoDesc,
      ogImage,
      featured: featured || false,
      affiliateUrl: body.affiliateUrl || null,
      outUtmSource: body.outUtmSource || "dailymieux",
      outUtmMedium: body.outUtmMedium || "article",
      outUtmCampaign: body.outUtmCampaign || finalSlug,
      productPrice: body.productPrice ? parseFloat(body.productPrice) : null,
      commissionRate: body.commissionRate ? parseFloat(body.commissionRate) : null,
      metaPixelId: body.metaPixelId || null,
      metaEvent: body.metaEvent || null,
      tiktokPixelId: body.tiktokPixelId || null,
      tiktokEvent: body.tiktokEvent || null,
      gaId: body.gaId || null,
      campaignTags: body.campaignTags || null,
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
