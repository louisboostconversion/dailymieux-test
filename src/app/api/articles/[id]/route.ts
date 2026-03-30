import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";
import { requireAuth, isAuthError } from "@/lib/auth";
import { validateArticleUpdate } from "@/lib/validation";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      category: true,
      author: true,
    },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json(article);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  const body = await request.json();
  const validationError = validateArticleUpdate(body);
  if (validationError) return validationError;

  const data: Record<string, unknown> = {};

  if (body.title !== undefined) {
    // Only regenerate slug if title actually changed
    const existing = await prisma.article.findUnique({ where: { id }, select: { title: true } });
    data.title = body.title;
    if (existing && body.title !== existing.title) {
      data.slug = slugify(body.title);
    }
  }
  if (body.excerpt !== undefined) data.excerpt = body.excerpt;
  if (body.content !== undefined) {
    data.content =
      typeof body.content === "string"
        ? body.content
        : JSON.stringify(body.content);
  }
  if (body.type !== undefined) data.type = body.type;
  if (body.authorId !== undefined) data.authorId = body.authorId;
  if (body.coverImage !== undefined) data.coverImage = body.coverImage;
  if (body.categoryId !== undefined) data.categoryId = body.categoryId;
  if (body.seoTitle !== undefined) data.seoTitle = body.seoTitle;
  if (body.seoDesc !== undefined) data.seoDesc = body.seoDesc;
  if (body.ogImage !== undefined) data.ogImage = body.ogImage;
  if (body.featured !== undefined) data.featured = body.featured;
  if (body.sponsorName !== undefined) data.sponsorName = body.sponsorName;
  if (body.sponsorLogo !== undefined) data.sponsorLogo = body.sponsorLogo;
  if (body.sponsorUrl !== undefined) data.sponsorUrl = body.sponsorUrl;
  if (body.ctaLabel !== undefined) data.ctaLabel = body.ctaLabel;
  if (body.ctaUrl !== undefined) data.ctaUrl = body.ctaUrl;
  if (body.topic !== undefined) data.topic = body.topic;
  if (body.affiliateUrl !== undefined) data.affiliateUrl = body.affiliateUrl;
  if (body.outUtmSource !== undefined) data.outUtmSource = body.outUtmSource;
  if (body.outUtmMedium !== undefined) data.outUtmMedium = body.outUtmMedium;
  if (body.outUtmCampaign !== undefined) data.outUtmCampaign = body.outUtmCampaign;
  if (body.productPrice !== undefined) data.productPrice = body.productPrice !== "" ? parseFloat(body.productPrice) : null;
  if (body.commissionRate !== undefined) data.commissionRate = body.commissionRate !== "" ? parseFloat(body.commissionRate) : null;
  if (body.metaPixelId !== undefined) data.metaPixelId = body.metaPixelId || null;
  if (body.metaEvent !== undefined) data.metaEvent = body.metaEvent || null;
  if (body.tiktokPixelId !== undefined) data.tiktokPixelId = body.tiktokPixelId || null;
  if (body.tiktokEvent !== undefined) data.tiktokEvent = body.tiktokEvent || null;
  if (body.gaId !== undefined) data.gaId = body.gaId || null;
  if (body.campaignTags !== undefined) data.campaignTags = body.campaignTags || null;

  // Auto-calculate read time from content
  const contentStr = (data.content as string) || body.content;
  if (contentStr) {
    const text = typeof contentStr === "string" ? contentStr : JSON.stringify(contentStr);
    const wordCount = text.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
    data.readTime = Math.max(1, Math.round(wordCount / 200));
  }

  if (body.status !== undefined) {
    data.status = body.status;
    if (body.status === "published") {
      const existing = await prisma.article.findUnique({ where: { id } });
      if (!existing?.publishedAt) {
        data.publishedAt = new Date();
      }
    }
  }

  const article = await prisma.article.update({
    where: { id },
    data,
    include: {
      category: true,
      author: true,
    },
  });

  return NextResponse.json(article);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
