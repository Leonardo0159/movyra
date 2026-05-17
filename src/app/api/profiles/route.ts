import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, JWTPayload, isTokenBlacklisted, profileSchema } from "@/lib/auth";

const MAX_PROFILES_PER_USER = 5;

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

  const profiles = await prisma.profile.findMany({
    where: { userId: user.userId },
    select: {
      id: true,
      name: true,
      avatarKey: true,
      avatarUrl: true,
      isActive: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(profiles);
}

export async function POST(request: NextRequest) {
  const user = await authenticateUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profileCount = await prisma.profile.count({
    where: { userId: user.userId },
  });

  if (profileCount >= MAX_PROFILES_PER_USER) {
    return NextResponse.json(
      { error: `Maximum of ${MAX_PROFILES_PER_USER} profiles reached` },
      { status: 400 }
    );
  }

  const body = await request.json();

  const validated = profileSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json(
      { error: "Invalid profile data" },
      { status: 400 }
    );
  }

  const { name, avatarKey, avatarUrl } = validated.data;

  const profile = await prisma.profile.create({
    data: {
      name,
      avatarKey,
      avatarUrl,
      userId: user.userId,
      isActive: profileCount === 0,
    },
    select: {
      id: true,
      name: true,
      avatarKey: true,
      avatarUrl: true,
      isActive: true,
    },
  });

  return NextResponse.json(profile, { status: 201 });
}
