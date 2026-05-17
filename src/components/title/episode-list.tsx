"use client";

import { useState } from "react";
import { FiClock, FiPlay } from "react-icons/fi";
import Link from "next/link";
import { SeasonGroup } from "@/lib/titles";

interface EpisodeListProps {
  seasons: SeasonGroup[];
  titleId: string;
}

export function EpisodeList({ seasons, titleId }: EpisodeListProps) {
  const [selectedSeason, setSelectedSeason] = useState(seasons[0]?.seasonNumber ?? 1);
  const currentEpisodes = seasons.find((s) => s.seasonNumber === selectedSeason)?.episodes ?? [];

  if (seasons.length === 0) return null;

  return (
    <section className="py-8" aria-labelledby="episodes-heading">
      <div className="mb-5 flex items-end gap-3">
        <h2 id="episodes-heading" className="text-2xl font-heading uppercase tracking-wider text-white md:text-3xl">
          Episodes
        </h2>
        <div className="h-px flex-1 bg-zinc-800/50" />
      </div>

      {seasons.length > 1 && (
        <div className="mb-6 flex gap-2 border-b border-zinc-800/50 pb-4" role="tablist" aria-label="Seasons">
          {seasons.map((season) => (
            <button
              key={season.seasonNumber}
              role="tab"
              aria-selected={selectedSeason === season.seasonNumber}
              onClick={() => setSelectedSeason(season.seasonNumber)}
              className={`rounded-sm px-4 py-2 text-sm font-heading uppercase tracking-wider transition-all ${
                selectedSeason === season.seasonNumber
                  ? "bg-amber/10 text-amber ring-1 ring-amber/20"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Season {season.seasonNumber}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {currentEpisodes.map((episode) => (
          <Link
            key={episode.id}
            href={`/watch/${titleId}?season=${episode.seasonNumber}&episode=${episode.id}`}
            className="group flex gap-4 rounded-sm bg-zinc-900/30 p-4 ring-1 ring-zinc-800/30 transition-all hover:bg-zinc-800/40 hover:ring-zinc-700/50"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-sm bg-zinc-800/80 text-sm font-medium text-zinc-500 transition-colors group-hover:bg-amber/20 group-hover:text-amber">
              {episode.episodeNumber}
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium text-zinc-200 group-hover:text-amber transition-colors">
                  {episode.name}
                </h3>
                {episode.synopsis && (
                  <p className="mt-1 line-clamp-1 text-sm text-zinc-500">{episode.synopsis}</p>
                )}
              </div>
              <div className="ml-4 flex items-center gap-3 text-zinc-500">
                {episode.duration && (
                  <span className="flex items-center gap-1 text-xs">
                    <FiClock className="h-3.5 w-3.5" />
                    {episode.duration}m
                  </span>
                )}
                <FiPlay className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
