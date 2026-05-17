import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@/lib/env";

const globalForR2 = globalThis as unknown as {
  r2Client: S3Client | undefined;
};

function getR2Endpoint(): string {
  if (env.R2_ACCOUNT_ID) {
    return `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  }
  return "http://localhost:9000"; // Local fallback for development
}

export const r2Client = globalForR2.r2Client ?? new S3Client({
  region: "auto",
  endpoint: getR2Endpoint(),
  credentials: env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY
    ? {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      }
    : undefined,
  forcePathStyle: true,
});

if (process.env.NODE_ENV !== "production") globalForR2.r2Client = r2Client;

export const R2_BUCKET = env.R2_BUCKET_NAME;

export const STORAGE_PATHS = {
  videos: (titleId: string) => `videos/${titleId}/`,
  thumbnails: (titleId: string) => `thumbnails/${titleId}/`,
  posters: (titleId: string) => `posters/${titleId}/`,
  backdrops: (titleId: string) => `backdrops/${titleId}/`,
  hls: (titleId: string) => `videos/${titleId}/hls/`,
};

export const ALLOWED_VIDEO_FORMATS = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "video/webm",
];

export const MAX_VIDEO_SIZE = 10 * 1024 * 1024 * 1024; // 10GB

export const ALLOWED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateVideoFile(mimeType: string, size: number): { valid: boolean; error?: string } {
  if (!ALLOWED_VIDEO_FORMATS.includes(mimeType)) {
    return { valid: false, error: `Unsupported video format: ${mimeType}` };
  }
  if (size > MAX_VIDEO_SIZE) {
    return { valid: false, error: `File size exceeds maximum allowed size of ${MAX_VIDEO_SIZE / (1024 * 1024 * 1024)}GB` };
  }
  return { valid: true };
}

export function validateImageFile(mimeType: string, size: number): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_FORMATS.includes(mimeType)) {
    return { valid: false, error: `Unsupported image format: ${mimeType}` };
  }
  if (size > MAX_IMAGE_SIZE) {
    return { valid: false, error: `File size exceeds maximum allowed size of ${MAX_IMAGE_SIZE / (1024 * 1024)}MB` };
  }
  return { valid: true };
}
