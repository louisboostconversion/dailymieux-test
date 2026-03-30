import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { articles: true } },
    },
  });
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, description, icon, color, order } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = slugify(name);
  const category = await prisma.category.create({
    data: { name, slug, description, icon, color, order: order ?? 0 },
  });

  return NextResponse.json(category, { status: 201 });
}
