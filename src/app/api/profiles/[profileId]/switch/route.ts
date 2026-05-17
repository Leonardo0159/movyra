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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  const user = await authenticateUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { profileId } = await params;

  const existingProfile = await prisma.profile.findFirst({
    where: { id: profileId, userId: user.userId },
  });

  if (!existingProfile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.profile.updateMany({
      where: { userId: user.userId, isActive: true },
      data: { isActive: false },
    });

    await tx.profile.update({
      where: { id: profileId },
      data: { isActive: true },
    });
  });

  const activeProfile = await prisma.profile.findUnique({
    where: { id: profileId },
    select: {
      id: true,
      name: true,
      avatarKey: true,
      avatarUrl: true,
    },
  });

  return NextResponse.json(activeProfile);
}
