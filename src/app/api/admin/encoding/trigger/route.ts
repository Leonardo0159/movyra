import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-middleware";
import { addEncodingJob } from "@/lib/encoding";
import { STORAGE_PATHS } from "@/lib/storage";
import { prisma } from "@/lib/prisma";
import { adminEncodingRateLimit } from "@/lib/rate-limiter";

export async function POST(request: NextRequest) {
  const auth = await verifyAdminToken(request);
  if ("status" in auth) return auth;

  // Aplica rate limiting por usuário
  const rateLimitResult = await adminEncodingRateLimit(auth.userId);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { titleId, episodeId, sourceKey } = body;

    if (!titleId || !sourceKey) {
      return NextResponse.json(
        { error: "titleId and sourceKey are required" },
        { status: 400 }
      );
    }

    // Validate title exists and is in PROCESSING status
    const title = await prisma.title.findUnique({
      where: { id: titleId },
      select: { status: true },
    });

    if (!title) {
      return NextResponse.json(
        { error: "Title not found" },
        { status: 404 }
      );
    }

    if (title.status !== "PROCESSING") {
      return NextResponse.json(
        { error: "Title is not in PROCESSING status" },
        { status: 400 }
      );
    }

    const outputPrefix = STORAGE_PATHS.hls(titleId);

    const job = await addEncodingJob({
      titleId,
      episodeId: episodeId ?? undefined,
      sourceKey,
      outputPrefix,
    });

    return NextResponse.json({
      jobId: job.id,
      status: "pending",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Trigger encoding error:", message);
    return NextResponse.json(
      { error: "Failed to trigger encoding" },
      { status: 500 }
    );
  }
}
