"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  registerSchema,
  loginSchema,
  hashPassword,
  comparePassword,
  generateTokenPair,
  verifyToken,
  JWTPayload,
  storeSession,
  deleteSession,
  blacklistToken,
  isTokenBlacklisted,
  getSession,
} from "@/lib/auth";
import { env } from "@/lib/env";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

function getCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge,
    path: "/",
  };
}

function parseJwtExpiry(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 60 * 60;
    case "d":
      return value * 24 * 60 * 60;
    default:
      return 7 * 24 * 60 * 60;
  }
}

export async function registerUser(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string; redirect?: string }> {
  try {
    const validated = registerSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name"),
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    const hashedPassword = await hashPassword(validated.password);

    const user = await prisma.user.create({
      data: {
        email: validated.email,
        password: hashedPassword,
        name: validated.name,
      },
    });

    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

    const accessTokenExpiry = parseJwtExpiry(env.JWT_EXPIRES_IN);
    await storeSession(accessToken, user.id, accessTokenExpiry);

    const cookieStore = await cookies();
    cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, getCookieOptions(accessTokenExpiry));
    cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, getCookieOptions(parseJwtExpiry(env.JWT_REFRESH_EXPIRES_IN)));

    return { success: true, redirect: "/select-profile" };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Registration failed. Please try again." };
  }
}

export async function loginUser(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string; redirect?: string }> {
  try {
    const validated = loginSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    const isValidPassword = await comparePassword(validated.password, user.password);
    if (!isValidPassword) {
      return { success: false, error: "Invalid email or password" };
    }

    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

    const accessTokenExpiry = parseJwtExpiry(env.JWT_EXPIRES_IN);
    await storeSession(accessToken, user.id, accessTokenExpiry);

    const cookieStore = await cookies();
    cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, getCookieOptions(accessTokenExpiry));
    cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, getCookieOptions(parseJwtExpiry(env.JWT_REFRESH_EXPIRES_IN)));

    return { success: true, redirect: "/select-profile" };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Login failed. Please try again." };
  }
}

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (accessToken) {
    const decoded = verifyToken<JWTPayload>(accessToken);
    if (decoded) {
      const accessTokenExpiry = parseJwtExpiry(env.JWT_EXPIRES_IN);
      await blacklistToken(accessToken, accessTokenExpiry);
      await deleteSession(accessToken);
    }
  }

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);

  redirect("/login");
}

export async function refreshToken(): Promise<boolean> {
  const cookieStore = await cookies();
  const refreshTokenValue = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshTokenValue) {
    return false;
  }

  const decoded = verifyToken<JWTPayload>(refreshTokenValue);
  if (!decoded) {
    cookieStore.delete(ACCESS_TOKEN_COOKIE);
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
    return false;
  }

  const isBlacklisted = await isTokenBlacklisted(refreshTokenValue);
  if (isBlacklisted) {
    cookieStore.delete(ACCESS_TOKEN_COOKIE);
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
    return false;
  }

  await blacklistToken(refreshTokenValue, parseJwtExpiry(env.JWT_REFRESH_EXPIRES_IN));

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { role: true },
  });

  if (!user) {
    cookieStore.delete(ACCESS_TOKEN_COOKIE);
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
    return false;
  }

  const tokenPayload: JWTPayload = {
    userId: decoded.userId,
    email: decoded.email,
    role: user.role,
  };

  const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(tokenPayload);

  const accessTokenExpiry = parseJwtExpiry(env.JWT_EXPIRES_IN);
  await storeSession(accessToken, decoded.userId, accessTokenExpiry);

  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, getCookieOptions(accessTokenExpiry));
  cookieStore.set(REFRESH_TOKEN_COOKIE, newRefreshToken, getCookieOptions(parseJwtExpiry(env.JWT_REFRESH_EXPIRES_IN)));

  return true;
}

export async function getCurrentUser(): Promise<{ userId: string; email: string } | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

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

  const sessionUserId = await getSession(accessToken);
  if (!sessionUserId || sessionUserId !== decoded.userId) {
    return null;
  }

  return { userId: decoded.userId, email: decoded.email };
}

export async function getActiveProfile(): Promise<{ id: string; name: string; avatarKey: string | null; avatarUrl: string | null } | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await prisma.profile.findFirst({
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

  return profile;
}
