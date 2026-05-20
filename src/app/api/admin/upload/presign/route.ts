import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-middleware";
import { generatePresignedUploadUrl, validateVideoFile, validateImageFile, STORAGE_PATHS } from "@/lib/storage";
import { adminUploadRateLimit } from "@/lib/rate-limiter";

// Sanitiza o nome do arquivo para prevenir path traversal
function sanitizeFilename(filename: string): string {
  // Remove qualquer componente de diretório
  const baseName = filename.split(/[\\/]/).pop() || filename;
  // Substitui caracteres não seguros por underscore
  return baseName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdminToken(request);
  if ("status" in auth) return auth;

  // Aplica rate limiting por usuário
  const rateLimitResult = await adminUploadRateLimit(auth.userId);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { type, filename, contentType, size, titleId } = body;

    if (!type || !filename || !contentType) {
      return NextResponse.json(
        { error: "Type, filename, and contentType are required" },
        { status: 400 }
      );
    }

    // Sanitiza o nome do arquivo para prevenir path traversal
    const safeFilename = sanitizeFilename(filename);

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

    // Generate key com nome sanitizado e timestamp para evitar colisões
    let key: string;
    const uniqueFilename = `${Date.now()}-${safeFilename}`;
    if (type === "video" && titleId) {
      key = `${STORAGE_PATHS.videos(titleId)}${uniqueFilename}`;
    } else if (type === "poster" && titleId) {
      key = `${STORAGE_PATHS.posters(titleId)}${uniqueFilename}`;
    } else if (type === "backdrop" && titleId) {
      key = `${STORAGE_PATHS.backdrops(titleId)}${uniqueFilename}`;
    } else if (type === "thumbnail" && titleId) {
      key = `${STORAGE_PATHS.thumbnails(titleId)}${uniqueFilename}`;
    } else {
      key = `uploads/${uniqueFilename}`;
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
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Presign upload error:", message);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
