import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-middleware";
import { generatePresignedUploadUrl, validateVideoFile, validateImageFile, STORAGE_PATHS } from "@/lib/storage";

export async function POST(request: NextRequest) {
  const auth = await verifyAdminToken(request);
  if ("status" in auth) return auth;

  try {
    const body = await request.json();
    const { type, filename, contentType, size, titleId } = body;

    if (!type || !filename || !contentType) {
      return NextResponse.json(
        { error: "Type, filename, and contentType are required" },
        { status: 400 }
      );
    }

    // Validate file
    if (type === "video") {
      const validation = validateVideoFile(contentType, size ?? 0);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    } else if (type === "image") {
      const validation = validateImageFile(contentType, size ?? 0);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }

    // Generate key
    let key: string;
    if (type === "video" && titleId) {
      key = `${STORAGE_PATHS.videos(titleId)}${filename}`;
    } else if (type === "poster" && titleId) {
      key = `${STORAGE_PATHS.posters(titleId)}${filename}`;
    } else if (type === "backdrop" && titleId) {
      key = `${STORAGE_PATHS.backdrops(titleId)}${filename}`;
    } else if (type === "thumbnail" && titleId) {
      key = `${STORAGE_PATHS.thumbnails(titleId)}${filename}`;
    } else {
      key = `uploads/${Date.now()}-${filename}`;
    }

    const uploadUrl = await generatePresignedUploadUrl({
      key,
      contentType,
      maxSize: size,
    });

    return NextResponse.json({
      uploadUrl,
      key,
    });
  } catch (error) {
    console.error("Presign upload error:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
