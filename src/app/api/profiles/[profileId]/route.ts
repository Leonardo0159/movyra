import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, JWTPayload, isTokenBlacklisted, profileSchema } from "@/lib/auth";

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

export async function PATCH(
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

  const body = await request.json();

  const validated = profileSchema.partial().safeParse(body);
  if (!validated.success) {
    return NextResponse.json(
      { error: "Invalid profile data" },
      { status: 400 }
    );
  }

  const { name, avatarKey, avatarUrl } = validated.data;

  const updatedProfile = await prisma.profile.update({
    where: { id: profileId },
    data: {
      ...(name !== undefined && { name }),
      ...(avatarKey !== undefined && { avatarKey }),
      ...(avatarUrl !== undefined && { avatarUrl }),
    },
    select: {
      id: true,
      name: true,
      avatarKey: true,
      avatarUrl: true,
      isActive: true,
    },
  });

  return NextResponse.json(updatedProfile);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  const user = await authenticateUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { profileId } = await params;

  const profileCount = await prisma.profile.count({
    where: { userId: user.userId },
  });

  if (profileCount <= 1) {
    return NextResponse.json(
      { error: "Cannot delete the last profile" },
      { status: 400 }
    );
  }

  const existingProfile = await prisma.profile.findFirst({
    where: { id: profileId, userId: user.userId },
  });

  if (!existingProfile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  await prisma.profile.delete({
    where: { id: profileId },
  });

  return NextResponse.json({ success: true });
}
