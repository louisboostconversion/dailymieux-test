import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";

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
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};

  if (body.title !== undefined) {
    data.title = body.title;
    data.slug = slugify(body.title);
  }
  if (body.excerpt !== undefined) data.excerpt = body.excerpt;
  if (body.content !== undefined) {
    data.content =
      typeof body.content === "string"
        ? body.content
        : JSON.stringify(body.content);
  }
  if (body.type !== undefined) data.type = body.type;
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
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
