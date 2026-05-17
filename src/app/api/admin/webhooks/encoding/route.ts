import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Webhook doesn't require auth - it's called by the encoding service
  const signature = request.headers.get("x-webhook-signature");

  // In production, verify the webhook signature here
  // if (!verifyWebhookSignature(signature, body)) {
  //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  // }

  try {
    const body = await request.json();
    const { jobId, status, titleId, episodeId } = body;

    console.log("Encoding webhook received:", { jobId, status, titleId, episodeId });

    // The actual job processing is handled by the BullMQ worker
    // This webhook is for external encoding services if used

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
