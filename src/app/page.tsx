import Image from "next/image";
import Link from "next/link";
import { Play, ChevronRight, Film, Tv, Clapperboard } from "lucide-react";
import { getFeaturedTitles, getCatalogByCategory, getRecentTitles } from "@/lib/catalog";
import { CategoryRow } from "@/components/catalog/category-row";
import { TitleCard } from "@/components/catalog/title-card";
import { Suspense } from "react";

export default async function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const [featured, categoryData, recent] = await Promise.all([
    getFeaturedTitles(5),
    getCatalogByCategory(),
    getRecentTitles(10),
  ]);

  const heroTitle = featured[0];
  const secondaryFeatured = featured.slice(1, 4);

  return (
    <div className="min-h-screen bg-[oklch(0.1_0.005_45)]">
      {/* Hero Section */}
      {heroTitle && (
        <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
          {/* Backdrop */}
          {heroTitle.backdropUrl ? (
            <Image
              src={heroTitle.backdropUrl}
              alt=""
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.15_0.02_45)] via-[oklch(0.1_0.005_45)] to-[oklch(0.08_0.01_85)]" />
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.1_0.005_45)] via-[oklch(0.1_0.005_45)]/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[oklch(0.1_0.005_45)] to-transparent" />
          <div className="absolute inset-0 film-grain" />

          {/* Content */}
          <div className="relative z-10 flex h-full items-center">
            <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
              <div className="max-w-2xl">
                <div className="mb-3 flex items-center gap-2 animate-fade-in-up">
                  <span className="rounded-sm bg-amber/20 px-2 py-0.5 text-xs font-medium uppercase tracking-widest text-amber">
                    Featured
                  </span>
                  <span className="text-xs uppercase tracking-widest text-zinc-500">
                    {heroTitle.type === "MOVIE" ? "Film" : heroTitle.type === "SERIES" ? "Series" : "Documentary"}
                  </span>
                </div>

                <h1 className="text-5xl font-heading uppercase leading-[0.9] tracking-wider text-white md:text-7xl lg:text-8xl animate-fade-in-up stagger-1">
                  {heroTitle.title}
                </h1>

                <div className="mt-4 flex items-center gap-3 text-sm text-zinc-400 animate-fade-in-up stagger-2">
                  {heroTitle.releaseYear && <span>{heroTitle.releaseYear}</span>}
                  {heroTitle.rating && (
                    <>
                      <span className="text-zinc-600">/</span>
                      <span className="rounded border border-zinc-700 px-1.5 py-0.5 text-xs">{heroTitle.rating}</span>
                    </>
                  )}
                  {heroTitle.duration && (
                    <>
                      <span className="text-zinc-600">/</span>
                      <span>{Math.floor(heroTitle.duration / 60)}h {heroTitle.duration % 60}m</span>
                    </>
                  )}
                </div>

                {heroTitle.synopsis && (
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-zinc-300 animate-fade-in-up stagger-3">
                    {heroTitle.synopsis.length > 200
                      ? `${heroTitle.synopsis.slice(0, 200)}...`
                      : heroTitle.synopsis}
                  </p>
                )}

                <div className="mt-6 flex items-center gap-3 animate-fade-in-up stagger-4">
                  <Link
                    href={`/watch/${heroTitle.id}`}
                    className="group flex items-center gap-2 rounded-sm bg-amber px-6 py-3 text-sm font-medium uppercase tracking-wider text-[oklch(0.1_0.005_45)] transition-all hover:bg-amber/90 hover:shadow-[0_0_30px_rgba(200,155,60,0.3)]"
                  >
                    <Play className="h-4 w-4 fill-current transition-transform group-hover:scale-110" />
                    Watch Now
                  </Link>
                  <Link
                    href={`/title/${heroTitle.id}`}
                    className="flex items-center gap-2 rounded-sm border border-zinc-700 bg-zinc-900/50 px-6 py-3 text-sm font-medium uppercase tracking-wider text-white backdrop-blur-sm transition-all hover:border-zinc-600 hover:bg-zinc-800/50"
                  >
                    Details
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Featured sidebar */}
          {secondaryFeatured.length > 0 && (
            <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
              {secondaryFeatured.map((title, i) => (
                <Link
                  key={title.id}
                  href={`/title/${title.id}`}
                  className="group relative h-20 w-36 overflow-hidden rounded-sm opacity-60 transition-all duration-300 hover:opacity-100 hover:shadow-[0_0_20px_rgba(200,155,60,0.2)]"
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                  {title.backdropUrl ? (
                    <Image
                      src={title.backdropUrl}
                      alt={title.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-zinc-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="truncate text-xs font-medium text-white">{title.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Quick Type Navigation */}
      <section className="border-b border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-6 py-4 md:px-8">
          <div className="flex items-center gap-6">
            <Link
              href="/catalog?type=MOVIE"
              className="group flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-amber"
            >
              <Film className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="font-heading uppercase tracking-wider">Films</span>
            </Link>
            <Link
              href="/catalog?type=SERIES"
              className="group flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-amber"
            >
              <Tv className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="font-heading uppercase tracking-wider">Series</span>
            </Link>
            <Link
              href="/catalog?type=DOCUMENTARY"
              className="group flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-amber"
            >
              <Clapperboard className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="font-heading uppercase tracking-wider">Documentaries</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Recently Added */}
      {recent.length > 0 && (
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-heading uppercase tracking-wider text-white md:text-4xl">
                  Recently Added
                </h2>
                <div className="mt-1 h-px w-12 bg-amber/60" />
              </div>
              <Link
                href="/catalog"
                className="flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-amber"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {recent.map((title) => (
                <TitleCard
                  key={title.id}
                  id={title.id}
                  type={title.type}
                  title={title.title}
                  releaseYear={title.releaseYear}
                  rating={title.rating}
                  posterUrl={title.posterUrl}
                  genres={title.genres}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Rows */}
      {categoryData.length > 0 && (
        <div className="pb-12">
          {categoryData.map((cat) => (
            <CategoryRow key={cat.slug} category={cat.category} titles={cat.titles} />
          ))}
        </div>
      )}
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-[oklch(0.1_0.005_45)]">
      <div className="h-[85vh] min-h-[600px] animate-shimmer bg-zinc-900" />
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-8">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-zinc-800" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-full">
              <div className="aspect-[2/3] animate-pulse rounded bg-zinc-800" />
              <div className="mt-2 h-4 w-32 animate-pulse rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
