import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get("brandId");
  const brandIds = searchParams.get("brandIds"); // comma-separated for comparison
  const articleIds = searchParams.get("articleIds"); // comma-separated for specific articles
  const days = searchParams.get("days");
  const dateFrom = searchParams.get("from");
  const dateTo = searchParams.get("to");

  // Determine date range
  let since: Date;
  let until: Date | undefined;

  if (dateFrom) {
    since = new Date(dateFrom);
    until = dateTo ? new Date(dateTo + "T23:59:59.999Z") : undefined;
  } else if (days === "all") {
    since = new Date("2020-01-01");
  } else {
    since = new Date();
    since.setDate(since.getDate() - parseInt(days || "30"));
  }

  const dateFilter: { gte: Date; lte?: Date } = { gte: since };
  if (until) dateFilter.lte = until;

  // Build article filter: specific articles > brands > all
  const articleIdList = articleIds ? articleIds.split(",").filter(Boolean) : [];
  const brandIdList = brandIds ? brandIds.split(",").filter(Boolean) : brandId ? [brandId] : [];

  let articleFilter: Record<string, unknown> = {};
  if (articleIdList.length > 0) {
    // Filter by specific articles
    articleFilter = { articleId: { in: articleIdList } };
  } else if (brandIdList.length > 0) {
    // Filter by brand(s)
    articleFilter = { articleId: { in: (await prisma.article.findMany({ where: { categoryId: { in: brandIdList } }, select: { id: true } })).map((a) => a.id) } };
  }

  const pageViewFilter = { createdAt: dateFilter, ...articleFilter };

  // 1. Total sessions & pageviews
  const [totalPageViews, uniqueSessions] = await Promise.all([
    prisma.pageView.count({ where: pageViewFilter }),
    prisma.pageView.groupBy({ by: ["sessionId"], where: pageViewFilter }).then((r) => r.length),
  ]);

  // 2. Source/Medium breakdown
  const sourceBreakdown = await prisma.pageView.groupBy({
    by: ["utmSource", "utmMedium"],
    where: pageViewFilter,
    _count: true,
    _avg: { timeOnPage: true, scrollDepth: true },
    orderBy: { _count: { sessionId: "desc" } },
    take: 20,
  });

  // 3. UTM Campaign performance
  const campaignPerformance = await prisma.pageView.groupBy({
    by: ["utmCampaign"],
    where: { ...pageViewFilter, utmCampaign: { not: null } },
    _count: true,
    _avg: { timeOnPage: true, scrollDepth: true },
    orderBy: { _count: { sessionId: "desc" } },
    take: 20,
  });

  // 3b. UTM Term breakdown
  const termBreakdown = await prisma.pageView.groupBy({
    by: ["utmTerm"],
    where: { ...pageViewFilter, utmTerm: { not: null } },
    _count: true,
    _avg: { timeOnPage: true, scrollDepth: true },
    orderBy: { _count: { sessionId: "desc" } },
    take: 20,
  });

  // 3c. UTM Content breakdown
  const contentBreakdown = await prisma.pageView.groupBy({
    by: ["utmContent"],
    where: { ...pageViewFilter, utmContent: { not: null } },
    _count: true,
    _avg: { timeOnPage: true, scrollDepth: true },
    orderBy: { _count: { sessionId: "desc" } },
    take: 20,
  });

  // 4. Top landing pages
  const topPages = await prisma.pageView.groupBy({
    by: ["path"],
    where: pageViewFilter,
    _count: true,
    _avg: { timeOnPage: true, scrollDepth: true },
    orderBy: { _count: { path: "desc" } },
    take: 10,
  });

  // 5. Engagement metrics
  const engagement = await prisma.pageView.aggregate({
    where: { ...pageViewFilter, timeOnPage: { not: null } },
    _avg: { timeOnPage: true, scrollDepth: true, loadTime: true, lcp: true, fid: true, cls: true, ttfb: true, inp: true },
  });

  const bounceCount = await prisma.pageView.count({
    where: { ...pageViewFilter, bounced: true },
  });

  // 6. Device breakdown
  const deviceBreakdown = await prisma.pageView.groupBy({
    by: ["device"],
    where: pageViewFilter,
    _count: true,
  });

  // 7. CTA clicks
  const eventFilter = {
    type: "cta_click" as const,
    createdAt: dateFilter,
    ...articleFilter,
  };

  const ctaClicks = await prisma.analyticsEvent.count({ where: eventFilter });

  const topCTAs = await prisma.analyticsEvent.groupBy({
    by: ["label"],
    where: eventFilter,
    _count: true,
    orderBy: { _count: { label: "desc" } },
    take: 10,
  });

  // 8. Daily pageviews for chart
  const dailyViews = await prisma.$queryRawUnsafe<{ date: string; count: bigint }[]>(`
    SELECT DATE("createdAt") as date, COUNT(*) as count
    FROM "PageView"
    WHERE "createdAt" >= $1
    ${until ? `AND "createdAt" <= '${until.toISOString()}'` : ""}
    ${articleIdList.length > 0 ? `AND "articleId" IN (${articleIdList.map((id) => `'${id}'`).join(",")})` : brandIdList.length > 0 ? `AND "articleId" IN (SELECT id FROM "Article" WHERE "categoryId" IN (${brandIdList.map((id) => `'${id}'`).join(",")}))` : ""}
    GROUP BY DATE("createdAt")
    ORDER BY date ASC
  `, since);

  // 9. Article stats (content management)
  const articleStatsFilter = articleIdList.length > 0
    ? { id: { in: articleIdList } }
    : brandIdList.length > 0
    ? { categoryId: { in: brandIdList } }
    : {};
  const articleStats = await prisma.article.groupBy({
    by: ["status"],
    where: articleStatsFilter,
    _count: true,
  });

  const recentArticles = await prisma.article.findMany({
    where: articleStatsFilter,
    select: {
      id: true,
      title: true,
      status: true,
      type: true,
      metaPixelId: true,
      tiktokPixelId: true,
      updatedAt: true,
      category: { select: { name: true, color: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  // 10. Scroll depth distribution
  const scrollDepthBuckets = await Promise.all(
    [25, 50, 75, 100].map(async (threshold) => ({
      threshold,
      count: await prisma.pageView.count({
        where: { ...pageViewFilter, scrollDepth: { gte: threshold } },
      }),
    }))
  );

  // 11. Outbound CTR
  const outboundCTR = totalPageViews > 0 ? (ctaClicks / totalPageViews) * 100 : 0;

  // 12. Newsletter subscribers count
  const newsletterCount = await prisma.newsletterSubscriber.count();

  // 13. Brands summary (always returned for the selector)
  const brandsSummary = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      color: true,
      icon: true,
      _count: { select: { articles: true } },
    },
    orderBy: { order: "asc" },
  });

  // 14. Available articles for selector
  const availableArticles = await prisma.article.findMany({
    where: brandIdList.length > 0 ? { categoryId: { in: brandIdList } } : {},
    select: { id: true, title: true, slug: true, status: true, category: { select: { name: true } } },
    orderBy: { title: "asc" },
  });

  return NextResponse.json({
    period: { days, since: since.toISOString() },
    traffic: {
      totalPageViews,
      uniqueSessions,
      sourceBreakdown: sourceBreakdown.map((s) => ({
        source: s.utmSource || "Direct",
        medium: s.utmMedium || "none",
        count: s._count,
        avgTimeOnPage: Math.round(s._avg.timeOnPage || 0),
        avgScrollDepth: Math.round(s._avg.scrollDepth || 0),
      })),
      campaignPerformance: campaignPerformance.map((c) => ({
        campaign: c.utmCampaign,
        count: c._count,
        avgTimeOnPage: Math.round(c._avg.timeOnPage || 0),
        avgScrollDepth: Math.round(c._avg.scrollDepth || 0),
      })),
      termBreakdown: termBreakdown.map((t) => ({
        term: t.utmTerm,
        count: t._count,
        avgTimeOnPage: Math.round(t._avg.timeOnPage || 0),
        avgScrollDepth: Math.round(t._avg.scrollDepth || 0),
      })),
      contentBreakdown: contentBreakdown.map((c) => ({
        content: c.utmContent,
        count: c._count,
        avgTimeOnPage: Math.round(c._avg.timeOnPage || 0),
        avgScrollDepth: Math.round(c._avg.scrollDepth || 0),
      })),
      topPages: topPages.map((p) => ({
        path: p.path,
        views: p._count,
        avgTimeOnPage: Math.round(p._avg.timeOnPage || 0),
        avgScrollDepth: Math.round(p._avg.scrollDepth || 0),
      })),
      dailyViews: dailyViews.map((d) => ({
        date: d.date,
        views: Number(d.count),
      })),
    },
    engagement: {
      avgTimeOnPage: Math.round(engagement._avg.timeOnPage || 0),
      avgScrollDepth: Math.round(engagement._avg.scrollDepth || 0),
      avgLoadTime: Math.round(engagement._avg.loadTime || 0),
      bounceRate: totalPageViews > 0 ? Math.round((bounceCount / totalPageViews) * 100) : 0,
      scrollDepthBuckets,
      webVitals: {
        lcp: Math.round(engagement._avg.lcp || 0),
        fid: Math.round(engagement._avg.fid || 0),
        cls: Math.round((engagement._avg.cls || 0) * 1000) / 1000,
        ttfb: Math.round(engagement._avg.ttfb || 0),
        inp: Math.round(engagement._avg.inp || 0),
      },
    },
    conversion: {
      ctaClicks,
      outboundCTR: Math.round(outboundCTR * 100) / 100,
      topCTAs: topCTAs.map((c) => ({ label: c.label, count: c._count })),
    },
    technical: {
      avgLoadTime: Math.round(engagement._avg.loadTime || 0),
      deviceBreakdown: deviceBreakdown.map((d) => ({
        device: d.device || "Unknown",
        count: d._count,
      })),
    },
    content: {
      articleStats: articleStats.map((s) => ({ status: s.status, count: s._count })),
      recentArticles,
    },
    brandsSummary,
    newsletterCount,
    availableArticles,
  });
}
