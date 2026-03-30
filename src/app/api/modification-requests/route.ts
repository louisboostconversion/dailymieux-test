import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isAuthError, AuthPayload } from "@/lib/auth";

// GET - list modification requests
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;
  const user = auth as AuthPayload;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const articleId = searchParams.get("articleId");

  const where: Record<string, unknown> = {};

  // Clients only see their own requests
  if (user.role === "client") {
    where.authorId = user.id;
  }

  if (status && status !== "all") {
    where.status = status;
  }

  if (articleId) {
    where.articleId = articleId;
  }

  const requests = await prisma.modificationRequest.findMany({
    where,
    include: {
      article: { select: { id: true, title: true, slug: true, coverImage: true, category: { select: { name: true, color: true } } } },
      author: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(requests);
}

// POST - create a modification request
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;
  const user = auth as AuthPayload;

  const body = await request.json();
  const { articleId, message } = body;

  if (!articleId || !message?.trim()) {
    return NextResponse.json({ error: "Article et message requis" }, { status: 400 });
  }

  // Verify the article exists (and belongs to client's brand if client)
  const articleWhere: Record<string, unknown> = { id: articleId };
  if (user.role === "client") {
    // Get the author to find their brandId
    const author = await prisma.author.findUnique({ where: { id: user.id }, select: { brandId: true } });
    if (author?.brandId) {
      articleWhere.categoryId = author.brandId;
    }
  }

  const article = await prisma.article.findFirst({ where: articleWhere });
  if (!article) {
    return NextResponse.json({ error: "Article non trouvé" }, { status: 404 });
  }

  const modRequest = await prisma.modificationRequest.create({
    data: {
      articleId,
      authorId: user.id,
      message: message.trim(),
    },
    include: {
      article: { select: { id: true, title: true, slug: true } },
      author: { select: { name: true } },
    },
  });

  // Send Slack notification
  const slackWebhook = process.env.SLACK_WEBHOOK_URL;
  if (slackWebhook) {
    const slackPayload = {
      text: `📝 *Nouvelle demande de modification*\n\n👤 *Client :* ${modRequest.author.name}\n📄 *Article :* ${modRequest.article.title}\n\n💬 *Message :*\n${message.trim().substring(0, 500)}`,
    };
    fetch(slackWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slackPayload),
    }).catch(() => {});
  }

  return NextResponse.json(modRequest, { status: 201 });
}
