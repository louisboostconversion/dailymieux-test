import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { compareSync } from "bcryptjs";
import { SignJWT } from "jose";
import { JWT_SECRET } from "@/lib/auth";
import { validateLogin } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limit: 5 attempts per IP per 15 minutes
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
  const rateLimitResponse = rateLimit(`login:${ip}`, { maxAttempts: 5, windowMs: 15 * 60 * 1000 });
  if (rateLimitResponse) return rateLimitResponse;

  const body = await request.json();
  const validationError = validateLogin(body);
  if (validationError) return validationError;

  const { email, password } = body;

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
    brandId: author.brandId || null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
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
    maxAge: 24 * 60 * 60,
    path: "/",
  });

  return response;
}
