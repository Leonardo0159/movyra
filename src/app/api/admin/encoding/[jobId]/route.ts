import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-middleware";
import { getEncodingJobStatus } from "@/lib/encoding";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const auth = await verifyAdminToken(request);
  if ("status" in auth) return auth;

  try {
    const { jobId } = await params;
    const status = await getEncodingJobStatus(jobId);

    if (!status) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ jobId, status });
  } catch (error) {
    console.error("Get encoding status error:", error);
    return NextResponse.json(
      { error: "Failed to get encoding status" },
      { status: 500 }
    );
  }
}
