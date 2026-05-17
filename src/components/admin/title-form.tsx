"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiX, FiUpload, FiTrash2 } from "react-icons/fi";

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

interface CastMember {
  id: string;
  name: string;
  role: string | null;
  imageUrl: string | null;
}

interface TitleFormData {
  id?: string;
  type: "MOVIE" | "SERIES" | "DOCUMENTARY";
  title: string;
  synopsis: string;
  releaseYear: string;
  rating: string;
  duration: string;
  posterUrl: string;
  backdropUrl: string;
  genreIds: string[];
  categoryIds: string[];
  castMembers: { castMemberId: string; characterName: string; order: number }[];
}

interface TitleFormProps {
  initialData?: TitleFormData;
  genres: Genre[];
  categories: Category[];
  castMembers: CastMember[];
  isEdit?: boolean;
}

export function TitleForm({
  initialData,
  genres,
  categories,
  castMembers: allCastMembers,
  isEdit = false,
}: TitleFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TitleFormData>(
    initialData ?? {
      type: "MOVIE",
      title: "",
      synopsis: "",
      releaseYear: "",
      rating: "",
      duration: "",
      posterUrl: "",
      backdropUrl: "",
      genreIds: [],
      categoryIds: [],
      castMembers: [],
    }
  );

  const toggleGenre = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      genreIds: prev.genreIds.includes(id)
        ? prev.genreIds.filter((gid) => gid !== id)
        : [...prev.genreIds, id],
    }));
  };

  const toggleCategory = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((cid) => cid !== id)
        : [...prev.categoryIds, id],
    }));
  };

  const addCastMember = (castMemberId: string) => {
    if (formData.castMembers.some((cm) => cm.castMemberId === castMemberId)) return;
    setFormData((prev) => ({
      ...prev,
      castMembers: [
        ...prev.castMembers,
        { castMemberId, characterName: "", order: prev.castMembers.length },
      ],
    }));
  };

  const removeCastMember = (castMemberId: string) => {
    setFormData((prev) => ({
      ...prev,
      castMembers: prev.castMembers.filter((cm) => cm.castMemberId !== castMemberId),
    }));
  };

  const updateCastMember = (castMemberId: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      castMembers: prev.castMembers.map((cm) =>
        cm.castMemberId === castMemberId ? { ...cm, [field]: value } : cm
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const url = isEdit && formData.id
          ? `/api/admin/titles/${formData.id}`
          : "/api/admin/titles";
        const method = isEdit ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            releaseYear: formData.releaseYear ? parseInt(formData.releaseYear, 10) : null,
            duration: formData.duration ? parseInt(formData.duration, 10) : null,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error ?? "Failed to save title");
        }

        router.push("/admin/content");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    });
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    if (!confirm("Are you sure you want to delete this title?")) return;

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/titles/${formData.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error ?? "Failed to delete title");
        }

        router.push("/admin/content");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-sm bg-red-900/30 border border-red-800/50 p-3 text-sm text-red-400" role="alert">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="rounded-sm border border-zinc-800/50 bg-zinc-900/30 p-6 backdrop-blur-sm">
        <h2 className="mb-4 font-heading text-lg uppercase tracking-wider text-white">Basic Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as TitleFormData["type"] }))}
              className="w-full rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-amber/40 focus:outline-none focus:ring-1 focus:ring-amber/20"
              required
            >
              <option value="MOVIE">Film</option>
              <option value="SERIES">Series</option>
              <option value="DOCUMENTARY">Documentary</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-amber/40 focus:outline-none focus:ring-1 focus:ring-amber/20"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Synopsis
            </label>
            <textarea
              value={formData.synopsis}
              onChange={(e) => setFormData((prev) => ({ ...prev, synopsis: e.target.value }))}
              rows={4}
              className="w-full rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-amber/40 focus:outline-none focus:ring-1 focus:ring-amber/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Release Year
            </label>
            <input
              type="number"
              value={formData.releaseYear}
              onChange={(e) => setFormData((prev) => ({ ...prev, releaseYear: e.target.value }))}
              className="w-full rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-amber/40 focus:outline-none focus:ring-1 focus:ring-amber/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Rating
            </label>
            <input
              type="text"
              value={formData.rating}
              onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value }))}
              placeholder="e.g., PG-13"
              className="w-full rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-amber/40 focus:outline-none focus:ring-1 focus:ring-amber/20"
            />
          </div>
          {formData.type === "MOVIE" && (
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                className="w-full rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-amber/40 focus:outline-none focus:ring-1 focus:ring-amber/20"
              />
            </div>
          )}
        </div>
      </div>

      {/* Images */}
      <div className="rounded-sm border border-zinc-800/50 bg-zinc-900/30 p-6 backdrop-blur-sm">
        <h2 className="mb-4 font-heading text-lg uppercase tracking-wider text-white">Images</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Poster URL
            </label>
            <input
              type="url"
              value={formData.posterUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, posterUrl: e.target.value }))}
              placeholder="https://..."
              className="w-full rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-amber/40 focus:outline-none focus:ring-1 focus:ring-amber/20"
            />
            {formData.posterUrl && (
              <div className="relative mt-2 aspect-[2/3] w-32 overflow-hidden rounded-sm ring-1 ring-zinc-700/50">
                <Image src={formData.posterUrl} alt="Poster preview" fill className="object-cover" />
              </div>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
              Backdrop URL
            </label>
            <input
              type="url"
              value={formData.backdropUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, backdropUrl: e.target.value }))}
              placeholder="https://..."
              className="w-full rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-amber/40 focus:outline-none focus:ring-1 focus:ring-amber/20"
            />
            {formData.backdropUrl && (
              <div className="relative mt-2 aspect-video w-64 overflow-hidden rounded-sm ring-1 ring-zinc-700/50">
                <Image src={formData.backdropUrl} alt="Backdrop preview" fill className="object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Genres */}
      <div className="rounded-sm border border-zinc-800/50 bg-zinc-900/30 p-6 backdrop-blur-sm">
        <h2 className="mb-4 font-heading text-lg uppercase tracking-wider text-white">Genres</h2>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre.id}
              type="button"
              onClick={() => toggleGenre(genre.id)}
              className={`rounded-sm px-3 py-1.5 text-sm transition-colors ${
                formData.genreIds.includes(genre.id)
                  ? "bg-amber/20 text-amber ring-1 ring-amber/30"
                  : "bg-zinc-800/50 text-zinc-400 hover:text-white"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-sm border border-zinc-800/50 bg-zinc-900/30 p-6 backdrop-blur-sm">
        <h2 className="mb-4 font-heading text-lg uppercase tracking-wider text-white">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={`rounded-sm px-3 py-1.5 text-sm transition-colors ${
                formData.categoryIds.includes(category.id)
                  ? "bg-amber/20 text-amber ring-1 ring-amber/30"
                  : "bg-zinc-800/50 text-zinc-400 hover:text-white"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Cast Members */}
      <div className="rounded-sm border border-zinc-800/50 bg-zinc-900/30 p-6 backdrop-blur-sm">
        <h2 className="mb-4 font-heading text-lg uppercase tracking-wider text-white">Cast & Crew</h2>
        <div className="mb-4">
          <select
            onChange={(e) => {
              if (e.target.value) {
                addCastMember(e.target.value);
                e.target.value = "";
              }
            }}
            className="w-full rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-amber/40 focus:outline-none focus:ring-1 focus:ring-amber/20"
          >
            <option value="">Add cast member...</option>
            {allCastMembers
              .filter((cm) => !formData.castMembers.some((fc) => fc.castMemberId === cm.id))
              .map((cm) => (
                <option key={cm.id} value={cm.id}>
                  {cm.name} ({cm.role})
                </option>
              ))}
          </select>
        </div>
        <div className="space-y-2">
          {formData.castMembers.map((cm) => {
            const member = allCastMembers.find((m) => m.id === cm.castMemberId);
            return (
              <div key={cm.castMemberId} className="flex items-center gap-3 rounded-sm bg-zinc-800/50 p-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-200">{member?.name}</p>
                  <input
                    type="text"
                    value={cm.characterName}
                    onChange={(e) => updateCastMember(cm.castMemberId, "characterName", e.target.value)}
                    placeholder="Character name"
                    className="mt-1 w-full rounded-sm border border-zinc-700/50 bg-zinc-900/50 px-2 py-1 text-xs text-white focus:border-amber/40 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCastMember(cm.castMemberId)}
                  className="rounded p-1 text-zinc-500 transition-colors hover:text-red-400"
                  aria-label={`Remove ${member?.name}`}
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="flex items-center gap-2 rounded-sm border border-red-800/50 bg-red-900/20 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/40 disabled:opacity-50"
            >
              <FiTrash2 className="h-4 w-4" />
              Delete
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-sm bg-amber px-4 py-2 text-sm font-medium text-[oklch(0.1_0.005_45)] transition-colors hover:bg-amber/90 disabled:opacity-50"
          >
            <FiUpload className="h-4 w-4" />
            {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </form>
  );
}
