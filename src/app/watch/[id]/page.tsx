"use client";

import { useEffect, useState, useCallback } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { VideoPlayer } from "@/components/player/video-player";
import { FiClock, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface WatchPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ episode?: string; season?: string }>;
}

interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  name: string;
  synopsis: string | null;
  duration: number | null;
  videoVersion: {
    hlsManifestUrl: string | null;
  } | null;
}

interface Title {
  id: string;
  type: "MOVIE" | "SERIES" | "DOCUMENTARY";
  title: string;
  synopsis: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  episodes: Episode[];
  videoVersions: {
    id: string;
    resolution: string;
    hlsManifestUrl: string | null;
  }[];
}

export default function WatchPage({ params, searchParams }: WatchPageProps) {
  const router = useRouter();
  const [title, setTitle] = useState<Title | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const { id } = await params;
      const { episode: episodeId } = await searchParams;

      try {
        const response = await fetch(`/api/titles/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error("Failed to fetch title");
        }

        const data = await response.json();
        setTitle(data);

        if (data.type === "SERIES" && data.episodes.length > 0) {
          const ep = episodeId
            ? data.episodes.find((e: Episode) => e.id === episodeId)
            : data.episodes[0];
          setCurrentEpisode(ep ?? null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params, searchParams]);

  const handleTimeUpdate = useCallback((time: number) => {
    setPlaybackProgress(time);
  }, []);

  const handleEnded = useCallback(() => {
    if (title?.type === "SERIES" && currentEpisode) {
      const episodes = title.episodes;
      const currentIndex = episodes.findIndex((e) => e.id === currentEpisode.id);
      if (currentIndex < episodes.length - 1) {
        const nextEpisode = episodes[currentIndex + 1];
        router.push(`/watch/${title.id}?season=${nextEpisode.seasonNumber}&episode=${nextEpisode.id}`);
      }
    }
  }, [title, currentEpisode, router]);

  const navigateEpisode = useCallback(
    (direction: "prev" | "next") => {
      if (!title || !currentEpisode || title.type !== "SERIES") return;

      const episodes = title.episodes;
      const currentIndex = episodes.findIndex((e) => e.id === currentEpisode.id);
      const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;

      if (newIndex >= 0 && newIndex < episodes.length) {
        const newEpisode = episodes[newIndex];
        router.push(`/watch/${title.id}?season=${newEpisode.seasonNumber}&episode=${newEpisode.id}`);
      }
    },
    [title, currentEpisode, router]
  );

  const getVideoUrl = (): string => {
    if (!title) return "";

    if (title.type === "SERIES" && currentEpisode?.videoVersion?.hlsManifestUrl) {
      return currentEpisode.videoVersion.hlsManifestUrl;
    }

    if (title.videoVersions.length > 0 && title.videoVersions[0].hlsManifestUrl) {
      return title.videoVersions[0].hlsManifestUrl;
    }

    return "";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.1_0.005_45)]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-amber/30 border-t-amber" />
          <p className="mt-4 font-heading text-sm uppercase tracking-wider text-zinc-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !title) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.1_0.005_45)]">
        <div className="text-center">
          <p className="font-heading text-lg uppercase tracking-wider text-zinc-500">{error ?? "Title not found"}</p>
          <Link href="/catalog" className="mt-4 inline-block text-sm text-amber hover:underline">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const videoUrl = getVideoUrl();
  if (!videoUrl) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.1_0.005_45)]">
        <div className="text-center">
          <p className="font-heading text-lg uppercase tracking-wider text-zinc-500">Video not available</p>
          <Link href={`/title/${title.id}`} className="mt-4 inline-block text-sm text-amber hover:underline">
            Back to {title.title}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.005_45)]">
      <div className="mx-auto max-w-7xl">
        {/* Video Player */}
        <div className="w-full">
          <VideoPlayer
            src={videoUrl}
            poster={title.backdropUrl ?? title.posterUrl ?? undefined}
            title={currentEpisode ? `${title.title} - ${currentEpisode.name}` : title.title}
            startTime={playbackProgress}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
          />
        </div>

        {/* Metadata and Navigation */}
        <div className="px-6 py-6 md:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-heading uppercase tracking-wider text-white md:text-2xl">
                {currentEpisode ? `${title.title}` : title.title}
              </h1>
              {currentEpisode && (
                <p className="mt-1 text-sm text-zinc-500">
                  <span className="text-amber">S{currentEpisode.seasonNumber} E{currentEpisode.episodeNumber}</span>
                  {currentEpisode.duration && ` - ${currentEpisode.duration}m`}
                </p>
              )}
              {(currentEpisode?.synopsis ?? title.synopsis) && (
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
                  {currentEpisode?.synopsis ?? title.synopsis}
                </p>
              )}
            </div>

            {title.type === "SERIES" && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigateEpisode("prev")}
                  disabled={!title.episodes.some(
                    (e) => e.id === currentEpisode?.id && title.episodes.indexOf(e) > 0
                  )}
                  className="flex items-center gap-1 rounded-sm border border-zinc-700/50 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-300 backdrop-blur-sm transition-all hover:border-zinc-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous episode"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigateEpisode("next")}
                  disabled={!title.episodes.some(
                    (e) => e.id === currentEpisode?.id && title.episodes.indexOf(e) < title.episodes.length - 1
                  )}
                  className="flex items-center gap-1 rounded-sm border border-zinc-700/50 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-300 backdrop-blur-sm transition-all hover:border-zinc-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next episode"
                >
                  <FiChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Episode list for series */}
          {title.type === "SERIES" && title.episodes.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 font-heading text-xl uppercase tracking-wider text-white">Episodes</h2>
              <div className="space-y-2">
                {title.episodes.map((episode) => (
                  <Link
                    key={episode.id}
                    href={`/watch/${title.id}?season=${episode.seasonNumber}&episode=${episode.id}`}
                    className={`flex gap-4 rounded-sm p-3 transition-all ${
                      currentEpisode?.id === episode.id
                        ? "bg-zinc-800/60 ring-1 ring-amber/20"
                        : "bg-zinc-900/30 hover:bg-zinc-800/40"
                    }`}
                  >
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-sm text-sm font-medium transition-colors ${
                      currentEpisode?.id === episode.id
                        ? "bg-amber/20 text-amber"
                        : "bg-zinc-800/80 text-zinc-500"
                    }`}>
                      {episode.episodeNumber}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${
                          currentEpisode?.id === episode.id ? "text-amber" : "text-zinc-200"
                        }`}>{episode.name}</h3>
                        {episode.duration && (
                          <span className="flex items-center gap-1 text-xs text-zinc-500">
                            <FiClock className="h-3 w-3" />
                            {episode.duration}m
                          </span>
                        )}
                      </div>
                      {episode.synopsis && (
                        <p className="mt-1 text-sm text-zinc-500">{episode.synopsis}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <Link
              href={`/title/${title.id}`}
              className="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-amber"
            >
              <FiChevronLeft className="h-4 w-4" />
              Back to details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
