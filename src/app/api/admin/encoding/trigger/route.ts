import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-middleware";
import { addEncodingJob } from "@/lib/encoding";
import { STORAGE_PATHS } from "@/lib/storage";

export async function POST(request: NextRequest) {
  const auth = await verifyAdminToken(request);
  if ("status" in auth) return auth;

  try {
    const body = await request.json();
    const { titleId, episodeId, sourceKey } = body;

    if (!titleId || !sourceKey) {
      return NextResponse.json(
        { error: "titleId and sourceKey are required" },
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

    // Update title status to processing
    const { prisma } = await import("@/lib/prisma");
    await prisma.title.update({
      where: { id: titleId },
      data: { status: "PROCESSING" },
    });

    return NextResponse.json({
      jobId: job.id,
      status: "pending",
    });
  } catch (error) {
    console.error("Trigger encoding error:", error);
    return NextResponse.json(
      { error: "Failed to trigger encoding" },
      { status: 500 }
    );
  }
}
