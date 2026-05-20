"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FiUpload, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { FilePicker } from "./file-picker";
import { UploadProgress } from "./upload-progress";
import { useMovieUpload } from "@/hooks/use-movie-upload";
import { createTitleWithMetadata } from "@/actions/movie-upload";
import { useToast } from "@/components/ui/toast";

interface Genre {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface MovieUploadFormProps {
  genres: Genre[];
  categories: Category[];
}

export function MovieUploadForm({ genres, categories }: MovieUploadFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [rating, setRating] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    file,
    uploadProgress,
    encodingStatus,
    isUploading,
    isEncoding,
    setFile,
    uploadFile,
    reset,
  } = useMovieUpload();

  const toggleGenre = (id: string) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((gid) => gid !== id) : [...prev, id]
    );
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!file) {
      setError("Please select a video file to upload");
      return;
    }

    startTransition(async () => {
      try {
        // Step 1: Create Title record via Server Action
        const result = await createTitleWithMetadata({
          type: "MOVIE",
          title: title.trim(),
          synopsis: synopsis.trim() || undefined,
          releaseYear: releaseYear ? parseInt(releaseYear, 10) : undefined,
          rating: rating.trim() || undefined,
          duration: duration ? parseInt(duration, 10) : undefined,
          genreIds: selectedGenres.length > 0 ? selectedGenres : undefined,
          categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
        });

        if (!result.success || !result.data) {
          throw new Error(result.error ?? "Failed to create title");
        }

        const titleId = result.data.id;

        // Step 2: Upload video file
        const uploadResult = await uploadFile(file, titleId);

        // Step 3: Trigger encoding
        const encodingResponse = await fetch("/api/admin/encoding/trigger", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titleId,
            sourceKey: uploadResult.key,
          }),
        });

        if (!encodingResponse.ok) {
          const data = await encodingResponse.json();
          throw new Error(data.error ?? "Failed to trigger encoding");
        }

        setSuccess("Movie uploaded successfully! Encoding in progress.");
        toast.success("Movie uploaded successfully! Encoding in progress.");
        router.refresh();

        // Reset form after successful upload
        setTimeout(() => {
          setTitle("");
          setSynopsis("");
          setReleaseYear("");
          setRating("");
          setDuration("");
          setSelectedGenres([]);
          setSelectedCategories([]);
          setFile(null);
          reset();
        }, 2000);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6">
      {(isPending || isUploading || isEncoding) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-sm bg-zinc-900/50 backdrop-blur-sm" aria-live="polite">
          <div className="flex items-center gap-3 rounded-sm bg-zinc-900 px-4 py-3 text-sm text-white">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber border-t-transparent"></div>
            {isUploading ? `Uploading... ${uploadProgress}%` : isEncoding ? "Encoding video..." : "Processing..."}
          </div>
        </div>
      )}
      {error && (
        <div id="form-error" className="flex items-center gap-2 rounded-sm bg-red-900/30 border border-red-800/50 p-3 text-sm text-red-400" role="alert" aria-live="assertive">
          <FiAlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-sm bg-green-900/30 border border-green-800/50 p-3 text-sm text-green-400" role="status">
          <FiCheckCircle className="h-4 w-4" />
          {success}
        </div>
      )}

      {/* Video File Upload */}
      <div className="rounded-sm border border-zinc-800/50 bg-zinc-900/30 p-6 backdrop-blur-sm">
        <h2 className="mb-4 font-heading text-lg uppercase tracking-wider text-white">Video File</h2>
        <FilePicker
          file={file}
          onFileSelect={setFile}
          disabled={isUploading || isEncoding}
        />
        {(isUploading || isEncoding || uploadProgress > 0) && (
          <div className="mt-4">
            <UploadProgress
              uploadProgress={uploadProgress}
              encodingStatus={encodingStatus}
            />
          </div>
        )}
      </div>

      {/* Basic Info */}
      <div className="rounded-sm border border-zinc-800/50 bg-zinc-900/30 p-6 backdrop-blur-sm">
        <h2 className="mb-4 font-heading text-lg uppercase tracking-wider text-white">Basic Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="movie-title" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Title *
            </label>
            <input
              id="movie-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-amber/40 focus:outline-none focus:ring-1 focus:ring-amber/20"
              required
              disabled={isPending || isUploading || isEncoding}
              aria-required="true"
              aria-describedby={error ? "form-error" : undefined}
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="movie-synopsis" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Synopsis
            </label>
            <textarea
              id="movie-synopsis"
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              rows={4}
              className="w-full rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-amber/40 focus:outline-none focus:ring-1 focus:ring-amber/20"
              disabled={isPending || isUploading || isEncoding}
            />
          </div>
          <div>
            <label htmlFor="movie-release-year" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Release Year
            </label>
            <input
              id="movie-release-year"
              type="number"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              className="w-full rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-amber/40 focus:outline-none focus:ring-1 focus:ring-amber/20"
              disabled={isPending || isUploading || isEncoding}
            />
          </div>
          <div>
            <label htmlFor="movie-rating" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Rating
            </label>
            <input
              id="movie-rating"
              type="text"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="e.g., PG-13"
              className="w-full rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-amber/40 focus:outline-none focus:ring-1 focus:ring-amber/20"
              disabled={isPending || isUploading || isEncoding}
            />
          </div>
          <div>
            <label htmlFor="movie-duration" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Duration (minutes)
            </label>
            <input
              id="movie-duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-amber/40 focus:outline-none focus:ring-1 focus:ring-amber/20"
              disabled={isPending || isUploading || isEncoding}
            />
          </div>
        </div>
      </div>

      {/* Genres */}
      <div className="rounded-sm border border-zinc-800/50 bg-zinc-900/30 p-6 backdrop-blur-sm">
        <h2 id="genres-heading" className="mb-4 font-heading text-lg uppercase tracking-wider text-white">Genres</h2>
        <div role="group" aria-labelledby="genres-heading" className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre.id}
              type="button"
              onClick={() => toggleGenre(genre.id)}
              className={`rounded-sm px-3 py-1.5 text-sm transition-colors ${
                selectedGenres.includes(genre.id)
                  ? "bg-amber/20 text-amber ring-1 ring-amber/30"
                  : "bg-zinc-800/50 text-zinc-400 hover:text-white"
              }`}
              disabled={isPending || isUploading || isEncoding}
              aria-pressed={selectedGenres.includes(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-sm border border-zinc-800/50 bg-zinc-900/30 p-6 backdrop-blur-sm">
        <h2 id="categories-heading" className="mb-4 font-heading text-lg uppercase tracking-wider text-white">Categories</h2>
        <div role="group" aria-labelledby="categories-heading" className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={`rounded-sm px-3 py-1.5 text-sm transition-colors ${
                selectedCategories.includes(category.id)
                  ? "bg-amber/20 text-amber ring-1 ring-amber/30"
                  : "bg-zinc-800/50 text-zinc-400 hover:text-white"
              }`}
              disabled={isPending || isUploading || isEncoding}
              aria-pressed={selectedCategories.includes(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending || isUploading || isEncoding}
          className="flex items-center gap-2 rounded-sm bg-amber px-4 py-2 text-sm font-medium text-[oklch(0.1_0.005_45)] transition-colors hover:bg-amber/90 disabled:opacity-50"
        >
          <FiUpload className="h-4 w-4" />
          {isUploading ? `Uploading... ${uploadProgress}%` : isEncoding ? "Encoding..." : isPending ? "Processing..." : "Upload Movie"}
        </button>
      </div>
    </form>
  );
}
