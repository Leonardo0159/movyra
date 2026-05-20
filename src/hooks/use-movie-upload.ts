import { useState, useCallback } from "react";

type EncodingStatus = "idle" | "pending" | "processing" | "completed" | "failed";

interface UploadResult {
  key: string;
  titleId: string;
}

interface UseMovieUploadReturn {
  file: File | null;
  uploadProgress: number;
  encodingStatus: EncodingStatus;
  isUploading: boolean;
  isEncoding: boolean;
  error: string | null;
  setFile: (file: File | null) => void;
  uploadFile: (file: File, titleId: string) => Promise<UploadResult>;
  reset: () => void;
}

const MAX_RETRIES = 3;

export function useMovieUpload(): UseMovieUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [encodingStatus, setEncodingStatus] = useState<EncodingStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const isUploading = uploadProgress > 0 && uploadProgress < 100;
  const isEncoding = encodingStatus === "pending" || encodingStatus === "processing";

  const uploadFile = useCallback(async (fileToUpload: File, titleId: string): Promise<UploadResult> => {
    setError(null);
    setUploadProgress(0);

    // Step 1: Get presigned URL
    const presignResponse = await fetch("/api/admin/upload/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "video",
        filename: fileToUpload.name,
        contentType: fileToUpload.type,
        size: fileToUpload.size,
        titleId,
      }),
    });

    if (!presignResponse.ok) {
      const data = await presignResponse.json();
      throw new Error(data.error ?? "Failed to get presigned URL");
    }

    const { uploadUrl, key } = await presignResponse.json();

    // Step 2: Upload file to presigned URL with progress tracking
    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        await uploadWithProgress(uploadUrl, fileToUpload, setUploadProgress);
        break; // Success, exit retry loop
      } catch (err) {
        retries++;
        if (retries >= MAX_RETRIES) {
          throw new Error(`Upload failed after ${MAX_RETRIES} attempts: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
      }
    }

    return { key, titleId };
  }, []);

  const reset = useCallback(() => {
    setFile(null);
    setUploadProgress(0);
    setEncodingStatus("idle");
    setError(null);
  }, []);

  return {
    file,
    uploadProgress,
    encodingStatus,
    isUploading,
    isEncoding,
    error,
    setFile,
    uploadFile,
    reset,
  };
}

function uploadWithProgress(
  url: string,
  file: File,
  onProgress: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload aborted"));
    });

    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}
