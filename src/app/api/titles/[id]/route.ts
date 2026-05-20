import { NextRequest, NextResponse } from "next/server";
import { getTitleById } from "@/lib/titles";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const title = await getTitleById(id);

    if (!title) {
      return NextResponse.json(
        { error: "Title not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(title);
  } catch (error) {
    console.error("Title API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch title" },
      { status: 500 }
    );
  }
}
