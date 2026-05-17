import Image from "next/image";
import Link from "next/link";
import { FiPlay, FiCalendar, FiClock } from "react-icons/fi";

interface BackdropHeroProps {
  backdropUrl: string | null;
  posterUrl: string | null;
  title: string;
  synopsis: string | null;
  releaseYear: number | null;
  duration: number | null;
  rating: string | null;
  type: string;
  watchUrl: string;
}

export function BackdropHero({
  backdropUrl,
  posterUrl,
  title,
  synopsis,
  releaseYear,
  duration,
  rating,
  type,
  watchUrl,
}: BackdropHeroProps) {
  const durationStr = duration ? `${Math.floor(duration / 60)}h ${duration % 60}m` : null;

  return (
    <div className="relative w-full">
      <div className="relative h-[55vh] min-h-[350px] w-full overflow-hidden md:h-[75vh]">
        {backdropUrl ? (
          <Image
            src={backdropUrl}
            alt=""
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.1_0.005_45)] via-[oklch(0.1_0.005_45)]/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[oklch(0.1_0.005_45)] to-transparent" />
        <div className="absolute inset-0 film-grain" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-end">
          {posterUrl && (
            <div className="relative hidden aspect-[2/3] w-44 overflow-hidden rounded-sm shadow-2xl ring-1 ring-zinc-700/50 sm:block">
              <Image src={posterUrl} alt="" fill className="object-cover" />
            </div>
          )}
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-sm bg-amber/20 px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-amber">
                {type}
              </span>
              {rating && (
                <span className="rounded-sm border border-zinc-700/50 px-1.5 py-0.5 text-xs text-zinc-400">
                  {rating}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-heading uppercase leading-[0.9] tracking-wider text-white md:text-6xl lg:text-7xl">
              {title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
              {releaseYear && (
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="h-4 w-4 text-zinc-600" />
                  {releaseYear}
                </span>
              )}
              {durationStr && (
                <span className="flex items-center gap-1.5">
                  <FiClock className="h-4 w-4 text-zinc-600" />
                  {durationStr}
                </span>
              )}
            </div>

            {synopsis && (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-300 md:text-base">{synopsis}</p>
            )}

            <div className="mt-6 flex gap-3">
              <Link
                href={watchUrl}
                className="group flex items-center gap-2 rounded-sm bg-amber px-8 py-3 text-sm font-medium uppercase tracking-wider text-[oklch(0.1_0.005_45)] transition-all hover:bg-amber/90 hover:shadow-[0_0_30px_rgba(200,155,60,0.3)]"
                aria-label={`Watch ${title}`}
              >
                <FiPlay className="h-4 w-4 fill-current transition-transform group-hover:scale-110" />
                Watch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
