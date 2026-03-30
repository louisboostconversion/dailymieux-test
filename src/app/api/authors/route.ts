import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const authors = await prisma.author.findMany({
    where: { role: { in: ["admin", "editor"] } },
    select: { id: true, name: true, avatar: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(authors);
}
