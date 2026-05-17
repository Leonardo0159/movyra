import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export async function verifyAdminToken(request: NextRequest): Promise<{ userId: string; role: string } | NextResponse> {
  const accessToken = request.cookies.get("access_token")?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(accessToken, secret);
    const { id, role } = payload as unknown as JWTPayload;

    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    return { userId: id, role };
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
