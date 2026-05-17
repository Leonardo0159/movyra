import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/login", "/register"];
const AUTH_ONLY_ROUTES = ["/login", "/register"];

const PUBLIC_ASSETS = [
  "/_next",
  "/favicon.ico",
  "/public",
  "/images",
  "/fonts",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_ASSETS.some((asset) => pathname.startsWith(asset)) ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;

  const isAuthenticated = accessToken ? await verifyAccessToken(accessToken) : false;

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route);
  const isAuthOnlyRoute = AUTH_ONLY_ROUTES.some((route) => pathname.startsWith(route));

  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isAuthOnlyRoute) {
    return NextResponse.redirect(new URL("/select-profile", request.url));
  }

  return NextResponse.next();
}

async function verifyAccessToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
