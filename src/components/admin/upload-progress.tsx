"use client";

import { FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

interface UploadProgressProps {
  uploadProgress: number;
  encodingStatus: "idle" | "pending" | "processing" | "completed" | "failed" | null;
}

export function UploadProgress({ uploadProgress, encodingStatus }: UploadProgressProps) {
  return (
    <div className="space-y-4">
      {/* Upload Progress */}
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span id="upload-progress-label" className="text-zinc-300">Upload Progress</span>
          <span aria-live="polite" className="text-zinc-400">{uploadProgress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full bg-amber transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
            role="progressbar"
            aria-valuenow={uploadProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-labelledby="upload-progress-label"
          />
        </div>
      </div>

      {/* Encoding Status */}
      {encodingStatus && encodingStatus !== "idle" && (
        <div role="status" aria-live="polite" className="flex items-center gap-2 text-sm">
          {encodingStatus === "pending" && (
            <>
              <FiLoader className="h-4 w-4 animate-spin text-amber" />
              <span className="text-zinc-300">Encoding queued...</span>
            </>
          )}
          {encodingStatus === "processing" && (
            <>
              <FiLoader className="h-4 w-4 animate-spin text-amber" />
              <span className="text-zinc-300">Encoding in progress...</span>
            </>
          )}
          {encodingStatus === "completed" && (
            <>
              <FiCheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-green-400">Encoding completed</span>
            </>
          )}
          {encodingStatus === "failed" && (
            <>
              <FiAlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-400">Encoding failed</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
