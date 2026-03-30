import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function resolveArticleId(articleId: string | null, path: string): Promise<string | null> {
  // If client sent an articleId, use it
  if (articleId) return articleId;

  // Otherwise, try to resolve from path: /{topic}/{slug}
  const parts = path.split("/").filter(Boolean);
  if (parts.length >= 2) {
    const slug = parts[parts.length - 1];
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (article) return article.id;
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === "pageview") {
      const articleId = await resolveArticleId(body.articleId, body.path || "/");

      const pv = await prisma.pageView.create({
        data: {
          sessionId: body.sessionId || "unknown",
          articleId,
          path: body.path || "/",
          referrer: body.referrer || null,
          utmSource: body.utmSource || null,
          utmMedium: body.utmMedium || null,
          utmCampaign: body.utmCampaign || null,
          utmTerm: body.utmTerm || null,
          utmContent: body.utmContent || null,
          device: body.device || null,
          browser: body.browser || null,
          os: body.os || null,
          loadTime: body.loadTime || null,
        },
      });

      // Increment article view counter
      if (articleId) {
        await prisma.article.update({
          where: { id: articleId },
          data: { views: { increment: 1 } },
        }).catch(() => {});
      }

      return NextResponse.json({ ok: true, pageViewId: pv.id });
    }

    if (type === "update" && body.pageViewId) {
      await prisma.pageView.update({
        where: { id: body.pageViewId },
        data: {
          timeOnPage: body.timeOnPage ?? undefined,
          scrollDepth: body.scrollDepth ?? undefined,
          bounced: body.bounced ?? undefined,
        },
      });
      return NextResponse.json({ ok: true });
    }

    if (type === "vitals") {
      // Update the most recent pageview for this session+path with web vitals
      const recentPv = await prisma.pageView.findFirst({
        where: {
          sessionId: body.sessionId || "unknown",
          path: body.path || "/",
        },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });

      if (recentPv) {
        await prisma.pageView.update({
          where: { id: recentPv.id },
          data: {
            lcp: body.lcp ?? undefined,
            fid: body.fid ?? undefined,
            cls: body.cls ?? undefined,
            ttfb: body.ttfb ?? undefined,
            inp: body.inp ?? undefined,
          },
        });
      }
      return NextResponse.json({ ok: true });
    }

    if (type === "event") {
      const eventArticleId = await resolveArticleId(body.articleId, body.path || "/");

      await prisma.analyticsEvent.create({
        data: {
          sessionId: body.sessionId || "unknown",
          articleId: eventArticleId,
          type: body.eventType || "click",
          label: body.label || null,
          value: body.value || null,
          path: body.path || "/",
        },
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
