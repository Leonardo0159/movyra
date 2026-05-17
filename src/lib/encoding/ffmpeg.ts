import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import { HLS_BITRATES, THUMBNAIL_TIMESTAMPS } from "./types";

export interface ThumbnailResult {
  filename: string;
  timestamp: number; // percentage
}

export function getVideoDuration(inputPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) return reject(err);
      const duration = metadata.format.duration;
      if (!duration) return reject(new Error("Could not determine video duration"));
      resolve(Math.round(duration));
    });
  });
}

export async function transcodeToHLS(inputPath: string, outputDir: string): Promise<string> {
  const masterPlaylistPath = path.join(outputDir, "master.m3u8");

  // Create a promise that resolves when all encodings are done
  const encodingPromises = HLS_BITRATES.map((profile) => {
    return new Promise<void>((resolve, reject) => {
      const outputPattern = path.join(outputDir, `${profile.resolution}_%03d.ts`);
      const playlistPath = path.join(outputDir, `${profile.resolution}.m3u8`);

      ffmpeg(inputPath)
        .outputOptions([
          `-c:v libx264`,
          `-c:a aac`,
          `-vf scale=${profile.width}:${profile.height}`,
          `-b:v ${profile.bitrate}k`,
          `-maxrate ${profile.maxRate}k`,
          `-bufsize ${profile.bitrate * 2}k`,
          `-pix_fmt yuv420p`,
          `-profile:v main`,
          `-preset fast`,
          `-g 48`,
          `-sc_threshold 0`,
          `-hls_time 4`,
          `-hls_playlist_type vod`,
          `-hls_segment_filename ${outputPattern}`,
          `-master_pl_name master.m3u8`,
        ])
        .output(playlistPath)
        .on("end", () => resolve())
        .on("error", (err) => reject(err))
        .run();
    });
  });

  await Promise.all(encodingPromises);

  // Generate master playlist
  await generateMasterPlaylist(outputDir, masterPlaylistPath);

  return masterPlaylistPath;
}

async function generateMasterPlaylist(outputDir: string, outputPath: string): Promise<void> {
  let content = "#EXTM3U\n#EXT-X-VERSION:3\n\n";

  for (const profile of HLS_BITRATES) {
    const playlistPath = path.join(outputDir, `${profile.resolution}.m3u8`);
    if (!fs.existsSync(playlistPath)) continue;

    content += `#EXT-X-STREAM-INF:BANDWIDTH=${profile.bitrate * 1000},RESOLUTION=${profile.width}x${profile.height}\n`;
    content += `${profile.resolution}.m3u8\n\n`;
  }

  fs.writeFileSync(outputPath, content);
}

export async function extractThumbnails(
  inputPath: string,
  outputDir: string,
  duration: number
): Promise<ThumbnailResult[]> {
  const results: ThumbnailResult[] = [];

  const extractPromises = THUMBNAIL_TIMESTAMPS.map((percentage) => {
    return new Promise<ThumbnailResult>((resolve, reject) => {
      const timestamp = (duration * percentage) / 100;
      const filename = `thumbnail_${percentage}.jpg`;
      const outputPath = path.join(outputDir, filename);

      ffmpeg(inputPath)
        .screenshots({
          timestamps: [timestamp],
          filename: filename,
          folder: outputDir,
          size: "640x?",
        })
        .on("end", () => resolve({ filename, timestamp: percentage }))
        .on("error", (err) => reject(err));
    });
  });

  const extracted = await Promise.all(extractPromises);
  results.push(...extracted);

  return results;
}
