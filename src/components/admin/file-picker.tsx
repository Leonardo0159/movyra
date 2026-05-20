"use client";

import { useState, useCallback } from "react";
import { FiUpload, FiFile, FiX, FiAlertCircle } from "react-icons/fi";

interface FilePickerProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

const ALLOWED_TYPES = [
  "video/mp4",
  "video/x-matroska",
  "video/avi",
  "video/quicktime",
  "video/x-msvideo",
];

const ALLOWED_EXTENSIONS = [".mp4", ".mkv", ".avi", ".mov"];
const MAX_SIZE = 10 * 1024 * 1024 * 1024; // 10GB

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function validateFile(file: File): string | null {
  const extension = "." + file.name.split(".").pop()?.toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`;
  }

  if (file.size > MAX_SIZE) {
    return `File too large. Maximum size: ${formatFileSize(MAX_SIZE)}`;
  }

  return null;
}

export function FilePicker({ file, onFileSelect, disabled = false }: FilePickerProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  }, [disabled, handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleRemove = () => {
    onFileSelect(null);
    setError(null);
  };

  if (file) {
    return (
      <div className="rounded-sm border border-zinc-700/50 bg-zinc-800/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiFile className="h-8 w-8 text-amber" />
            <div>
              <p className="text-sm font-medium text-white">{file.name}</p>
              <p className="text-xs text-zinc-400">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="rounded p-1 text-zinc-500 transition-colors hover:text-red-400"
            aria-label="Remove file"
            disabled={disabled}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-sm border-2 border-dashed p-8 text-center transition-colors ${
          isDragOver
            ? "border-amber bg-amber/5"
            : "border-zinc-700/50 hover:border-zinc-600"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <input
          type="file"
          accept={ALLOWED_EXTENSIONS.join(",")}
          onChange={handleInputChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          disabled={disabled}
          aria-label="Select video file"
        />
        <FiUpload className={`mx-auto mb-3 h-10 w-10 ${isDragOver ? "text-amber" : "text-zinc-500"}`} />
        <p className="text-sm text-zinc-300">
          {isDragOver ? "Drop file here" : "Drag and drop or click to select"}
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          MP4, MKV, AVI, MOV (max {formatFileSize(MAX_SIZE)})
        </p>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-400" role="alert">
          <FiAlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
