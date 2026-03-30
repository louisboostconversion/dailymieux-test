import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isAuthError, AuthPayload } from "@/lib/auth";

// PUT - update a modification request
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;
  const user = auth as AuthPayload;

  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.modificationRequest.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Demande non trouvée" }, { status: 404 });
  }

  // Client can only edit their own pending requests
  if (user.role === "client") {
    if (existing.authorId !== user.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }
    if (existing.status !== "pending") {
      return NextResponse.json({ error: "Impossible de modifier une demande deja traitee" }, { status: 400 });
    }
    const updated = await prisma.modificationRequest.update({
      where: { id },
      data: { message: body.message?.trim() || existing.message },
    });
    return NextResponse.json(updated);
  }

  // Admin can change status and add reply
  const data: Record<string, unknown> = {};
  if (body.status) data.status = body.status;
  if (body.adminReply !== undefined) data.adminReply = body.adminReply;

  const updated = await prisma.modificationRequest.update({
    where: { id },
    data,
    include: {
      article: { select: { id: true, title: true } },
      author: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json(updated);
}

// DELETE - delete a request
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;
  const user = auth as AuthPayload;

  const { id } = await params;
  const existing = await prisma.modificationRequest.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Demande non trouvée" }, { status: 404 });
  }

  if (user.role === "client" && (existing.authorId !== user.id || existing.status !== "pending")) {
    return NextResponse.json({ error: "Non autorise" }, { status: 403 });
  }

  await prisma.modificationRequest.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
