export enum EncodingJobStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface EncodingJobData {
  titleId: string;
  episodeId?: string;
  sourceKey: string; // R2 key of the uploaded source video
  outputPrefix: string; // R2 prefix for encoded output
}

export interface EncodingJobResult {
  status: EncodingJobStatus;
  videoVersions: {
    resolution: string;
    bitrate: number;
    hlsManifestUrl: string;
    storageKey: string;
    duration: number; // in seconds
  }[];
  thumbnails: {
    key: string;
    timestamp: number; // percentage (10, 30, 50, 70, 90)
  }[];
  error?: string;
}

export const ENCODING_QUEUE = "video-encoding";
export const ENCODING_CONCURRENCY = 2;

export const HLS_BITRATES = [
  { resolution: "360p", width: 640, height: 360, bitrate: 800, maxRate: 856 },
  { resolution: "480p", width: 854, height: 480, bitrate: 1400, maxRate: 1498 },
  { resolution: "720p", width: 1280, height: 720, bitrate: 2800, maxRate: 2996 },
  { resolution: "1080p", width: 1920, height: 1080, bitrate: 5000, maxRate: 5348 },
];

export const THUMBNAIL_TIMESTAMPS = [10, 30, 50, 70, 90];
