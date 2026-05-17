import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET } from "./r2";

export interface PresignedUploadUrlOptions {
  key: string;
  contentType: string;
  expiresIn?: number; // seconds
  maxSize?: number; // bytes
}

export interface PresignedDownloadUrlOptions {
  key: string;
  expiresIn?: number; // seconds
}

export async function generatePresignedUploadUrl({
  key,
  contentType,
  expiresIn = 3600, // 1 hour default
  maxSize,
}: PresignedUploadUrlOptions): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
    ContentLength: maxSize,
  });

  return getSignedUrl(r2Client, command, { expiresIn });
}

export async function generatePresignedDownloadUrl({
  key,
  expiresIn = 3600,
}: PresignedDownloadUrlOptions): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });

  return getSignedUrl(r2Client, command, { expiresIn });
}

export function getPublicUrl(key: string): string | null {
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl) return null;
  return `${publicUrl.replace(/\/$/, "")}/${key}`;
}
