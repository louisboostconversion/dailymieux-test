import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST: create a new request (from contact form - public)
export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, message } = await req.json();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    const request = await prisma.request.create({
      data: { firstName, lastName, email, message },
    });

    return NextResponse.json(request, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création de la demande" },
      { status: 500 }
    );
  }
}

// GET: list all requests (admin only)
export async function GET() {
  try {
    const requests = await prisma.request.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des demandes" },
      { status: 500 }
    );
  }
}
