import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, JWTPayload, isTokenBlacklisted } from "@/lib/auth";

async function authenticateUser(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    return null;
  }

  const isBlacklisted = await isTokenBlacklisted(accessToken);
  if (isBlacklisted) {
    return null;
  }

  const decoded = verifyToken<JWTPayload>(accessToken);
  if (!decoded) {
    return null;
  }

  return decoded;
}

export async function GET(request: NextRequest) {
  const user = await authenticateUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activeProfile = await prisma.profile.findFirst({
    where: {
      userId: user.userId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      avatarKey: true,
      avatarUrl: true,
    },
  });

  if (!activeProfile) {
    return NextResponse.json(null);
  }

  return NextResponse.json(activeProfile);
}
