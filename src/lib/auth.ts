import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
  throw new Error(
    "JWT_SECRET environment variable is not set. " +
    "Please define it in your .env.local (dev) or environment variables (production)."
  );
}

export const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export interface AuthPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Verify JWT token from the admin-token cookie.
 * Returns the payload if valid, or a 401 NextResponse if not.
 */
export async function requireAuth(
  request: NextRequest
): Promise<AuthPayload | NextResponse> {
  const token = request.cookies.get("admin-token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

export function isAuthError(
  result: AuthPayload | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}
