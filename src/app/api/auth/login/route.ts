import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { compareSync } from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "daily-mieux-secret-key-change-in-production"
);

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const author = await prisma.author.findUnique({ where: { email } });

  if (!author || !compareSync(password, author.password)) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = await new SignJWT({
    id: author.id,
    email: author.email,
    name: author.name,
    role: author.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const response = NextResponse.json({
    user: {
      id: author.id,
      name: author.name,
      email: author.email,
      role: author.role,
    },
  });

  response.cookies.set("admin-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}
