import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export async function requireAdmin(request: NextRequest): Promise<boolean> {
  const accessToken = request.cookies.get("access_token")?.value;
  if (!accessToken) return false;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(accessToken, secret);
    return (payload as unknown as JWTPayload).role === "ADMIN";
  } catch {
    return false;
  }
}

export function isAdminRole(role: string | undefined): boolean {
  return role === "ADMIN";
}
