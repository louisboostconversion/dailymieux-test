import { prisma } from "@/lib/db";
import Link from "next/link";
import { FileText, Eye, FolderOpen, TrendingUp, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [articleCount, publishedCount, draftCount, categoryCount, recentArticles, totalViews, pendingRequests] =
    await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: "published" } }),
      prisma.article.count({ where: { status: "draft" } }),
      prisma.category.count(),
      prisma.article.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true, color: true } },
        },
      }),
      prisma.article.aggregate({ _sum: { views: true } }),
      prisma.request.count({ where: { status: "pending" } }),
    ]);

  const stats = [
    {
      label: "Total articles",
      value: articleCount,
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      label: "Publiés",
      value: publishedCount,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      label: "Brouillons",
      value: draftCount,
      icon: FileText,
      color: "bg-amber-500",
    },
    {
      label: "Catégories",
      value: categoryCount,
      icon: FolderOpen,
      color: "bg-purple-500",
    },
    {
      label: "Demandes en attente",
      value: pendingRequests,
      icon: MessageSquare,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color} text-white`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total views */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Eye className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Total des vues :</span>
          <span className="text-lg font-bold text-gray-900">
            {totalViews._sum.views || 0}
          </span>
        </div>
      </div>

      {/* Recent articles */}
      <div className="rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="font-semibold text-gray-900">Articles récents</h3>
          <Link
            href="/admin/articles"
            className="text-sm text-[#2D5A3D] hover:underline"
          >
            Voir tout →
          </Link>
        </div>
        <div className="divide-y">
          {recentArticles.map((article) => (
            <Link
              key={article.id}
              href={`/admin/articles/${article.id}/edit`}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      article.status === "published" ? "#22c55e" : "#f59e0b",
                  }}
                />
                <div>
                  <p className="font-medium text-gray-900">{article.title}</p>
                  <p className="text-sm text-gray-500">
                    {article.category.name} · {article.type}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(article.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-4">
        <Link
          href="/admin/articles/new"
          className="rounded-lg bg-[#2D5A3D] px-6 py-3 font-medium text-white transition-colors hover:bg-[#234a31]"
        >
          + Nouvel article
        </Link>
        <Link
          href="/admin/categories"
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Gérer les catégories
        </Link>
      </div>
    </div>
  );
}
