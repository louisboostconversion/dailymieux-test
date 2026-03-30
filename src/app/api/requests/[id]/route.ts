import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// PUT: update request status (approve/reject)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Statut invalide. Utilisez: pending, approved, rejected" },
        { status: 400 }
      );
    }

    const request = await prisma.request.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(request);
  } catch {
    return NextResponse.json(
      { error: "Demande introuvable" },
      { status: 404 }
    );
  }
}

// DELETE: delete a request
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.request.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Demande introuvable" },
      { status: 404 }
    );
  }
}
