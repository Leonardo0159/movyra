import { Queue, Worker, Job } from "bullmq";
import { redis } from "../redis";
import { ENCODING_QUEUE, ENCODING_CONCURRENCY, EncodingJobData, EncodingJobResult, EncodingJobStatus } from "./types";
import { transcodeToHLS, extractThumbnails, getVideoDuration } from "./ffmpeg";
import { r2Client, R2_BUCKET, STORAGE_PATHS } from "../storage/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "../prisma";
import fs from "fs";
import path from "path";
import os from "os";

const globalForEncoding = globalThis as unknown as {
  encodingQueue: Queue | undefined;
  encodingWorker: Worker | undefined;
};

export const encodingQueue = globalForEncoding.encodingQueue ?? new Queue(ENCODING_QUEUE, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 60000, // 1 minute
    },
    removeOnComplete: { age: 86400 }, // Keep for 24 hours
    removeOnFail: { age: 604800 }, // Keep for 7 days
  },
});

if (process.env.NODE_ENV !== "production") globalForEncoding.encodingQueue = encodingQueue;

export async function addEncodingJob(data: EncodingJobData): Promise<Job> {
  return encodingQueue.add(ENCODING_QUEUE, data, {
    jobId: `${data.titleId}-${data.episodeId ?? "movie"}-${Date.now()}`,
  });
}

export async function getEncodingJobStatus(jobId: string): Promise<EncodingJobStatus | null> {
  const job = await encodingQueue.getJob(jobId);
  if (!job) return null;

  const state = await job.getState();
  switch (state) {
    case "waiting":
    case "delayed":
      return EncodingJobStatus.PENDING;
    case "active":
      return EncodingJobStatus.PROCESSING;
    case "completed":
      return EncodingJobStatus.COMPLETED;
    case "failed":
      return EncodingJobStatus.FAILED;
    default:
      return null;
  }
}

// Worker is only started in server context, not during builds
export function createEncodingWorker(): Worker | undefined {
  if (process.env.NEXT_PHASE === "phase-production-build") return undefined;

  if (globalForEncoding.encodingWorker) return globalForEncoding.encodingWorker;

  const worker = new Worker(
    ENCODING_QUEUE,
    async (job: Job<EncodingJobData>) => processEncodingJob(job),
    {
      connection: redis,
      concurrency: ENCODING_CONCURRENCY,
    }
  );

  worker.on("completed", (job) => {
    console.log(`Encoding job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`Encoding job ${job?.id} failed:`, err.message);
  });

  globalForEncoding.encodingWorker = worker;
  return worker;
}

async function processEncodingJob(job: Job<EncodingJobData>): Promise<EncodingJobResult> {
  const { titleId, episodeId, sourceKey, outputPrefix } = job.data;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "movyra-encoding-"));

  try {
    // Download source video from R2
    const sourcePath = path.join(tempDir, "source.mp4");
    await downloadFromR2(sourceKey, sourcePath);

    // Get video duration
    const duration = await getVideoDuration(sourcePath);

    // Transcode to HLS
    const hlsOutputDir = path.join(tempDir, "hls");
    fs.mkdirSync(hlsOutputDir, { recursive: true });
    const hlsManifestPath = await transcodeToHLS(sourcePath, hlsOutputDir);

    // Extract thumbnails
    const thumbnailDir = path.join(tempDir, "thumbnails");
    fs.mkdirSync(thumbnailDir, { recursive: true });
    const thumbnails = await extractThumbnails(sourcePath, thumbnailDir, duration);

    // Upload HLS files to R2
    await uploadDirectoryToR2(hlsOutputDir, outputPrefix);

    // Upload thumbnails to R2
    const thumbnailPrefix = STORAGE_PATHS.thumbnails(titleId);
    await uploadDirectoryToR2(thumbnailDir, thumbnailPrefix);

    // Build result
    const result: EncodingJobResult = {
      status: EncodingJobStatus.COMPLETED,
      videoVersions: [],
      thumbnails: thumbnails.map((t) => ({
        key: `${thumbnailPrefix}${t.filename}`,
        timestamp: t.timestamp,
      })),
    };

    // Create video version records in database
    const hlsFiles = fs.readdirSync(hlsOutputDir).filter((f) => f.endsWith(".m3u8"));
    for (const hlsFile of hlsFiles) {
      if (hlsFile === "master.m3u8") continue;
      const resolution = hlsFile.replace(".m3u8", "");
      const storageKey = `${outputPrefix}${hlsFile}`;
      const manifestUrl = `${outputPrefix}master.m3u8`;

      await prisma.videoVersion.create({
        data: {
          titleId: episodeId ? undefined : titleId,
          episodeId: episodeId ?? undefined,
          resolution,
          hlsManifestUrl: manifestUrl,
          storageKey,
          duration,
        },
      });

      result.videoVersions.push({
        resolution,
        bitrate: 0, // Would need to parse from HLS playlist
        hlsManifestUrl: manifestUrl,
        storageKey,
        duration,
      });
    }

    // Update title/episode status
    if (episodeId) {
      await prisma.title.update({
        where: { id: titleId },
        data: { status: "PUBLISHED" },
      });
    } else {
      await prisma.title.update({
        where: { id: titleId },
        data: { status: "PUBLISHED" },
      });
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      status: EncodingJobStatus.FAILED,
      videoVersions: [],
      thumbnails: [],
      error: errorMessage,
    };
  } finally {
    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

async function downloadFromR2(key: string, outputPath: string): Promise<void> {
  const { GetObjectCommand } = await import("@aws-sdk/client-s3");
  const command = new GetObjectCommand({ Bucket: R2_BUCKET, Key: key });
  const response = await r2Client.send(command);

  if (!response.Body) throw new Error("Empty response from R2");

  const stream = response.Body as NodeJS.ReadableStream;
  const fileStream = fs.createWriteStream(outputPath);
  await new Promise<void>((resolve, reject) => {
    stream.pipe(fileStream).on("finish", () => resolve()).on("error", reject);
  });
}

async function uploadDirectoryToR2(localDir: string, remotePrefix: string): Promise<void> {
  const files = getAllFiles(localDir);
  for (const file of files) {
    const relativePath = path.relative(localDir, file);
    const key = `${remotePrefix}${relativePath}`;
    const fileContent = fs.readFileSync(file);

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: fileContent,
      ContentType: getContentType(file),
    });

    await r2Client.send(command);
  }
}

function getAllFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const types: Record<string, string> = {
    ".m3u8": "application/vnd.apple.mpegurl",
    ".ts": "video/MP2T",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };
  return types[ext] || "application/octet-stream";
}
