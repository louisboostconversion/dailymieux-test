import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isAuthError } from "@/lib/auth";

// PUT - update a planned article (approve, reject, edit)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.plannedArticle.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Article planifié non trouvé" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.topic !== undefined) data.topic = body.topic;
  if (body.angle !== undefined) data.angle = body.angle;
  if (body.keywords !== undefined) data.keywords = body.keywords;
  if (body.outline !== undefined) data.outline = body.outline;
  if (body.status !== undefined) data.status = body.status;
  if (body.scheduledFor !== undefined) data.scheduledFor = new Date(body.scheduledFor);
  if (body.rejectedReason !== undefined) data.rejectedReason = body.rejectedReason;

  const updated = await prisma.plannedArticle.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

// DELETE - remove a planned article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  await prisma.plannedArticle.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
