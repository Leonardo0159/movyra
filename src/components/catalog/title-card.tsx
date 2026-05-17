import Link from "next/link";
import Image from "next/image";
import { TitleType } from "@prisma/client";

interface TitleCardProps {
  id: string;
  type: TitleType;
  title: string;
  releaseYear: number | null;
  rating: string | null;
  posterUrl: string | null;
  genres: { name: string }[];
}

const typeLabels: Record<TitleType, string> = {
  MOVIE: "Film",
  SERIES: "Series",
  DOCUMENTARY: "Doc",
};

export function TitleCard({ id, type, title, releaseYear, rating, posterUrl, genres }: TitleCardProps) {
  return (
    <Link
      href={`/title/${id}`}
      className="group flex-shrink-0 w-36 sm:w-44 md:w-48"
      aria-label={`${title} (${typeLabels[type]})`}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-sm bg-zinc-800/50 ring-1 ring-zinc-800/50 transition-all duration-300 group-hover:ring-amber/30 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 192px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-800/80">
            <span className="font-heading text-lg uppercase tracking-wider text-zinc-600">No Image</span>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span className="inline-block rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-300 backdrop-blur-sm">
            {typeLabels[type]}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 right-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
          <p className="text-xs text-zinc-300 line-clamp-2">
            {genres.slice(0, 2).map((g) => g.name).join(", ")}
          </p>
        </div>
      </div>

      <div className="mt-2.5 px-0.5">
        <h3 className="truncate text-sm font-medium text-zinc-200 transition-colors group-hover:text-amber">{title}</h3>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
          {releaseYear && <span>{releaseYear}</span>}
          {rating && (
            <>
              <span className="text-zinc-700">/</span>
              <span className="rounded-sm border border-zinc-700/50 px-1 py-px text-[10px]">{rating}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
