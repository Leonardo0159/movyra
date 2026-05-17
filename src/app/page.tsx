import { Suspense } from "react";
import { getFeaturedTitles, getCatalogByCategory, getRecentTitles } from "@/lib/catalog";
import { CategoryRow } from "@/components/catalog/category-row";
import { TitleCard } from "@/components/catalog/title-card";
import { HeroCarousel } from "@/components/catalog/hero-carousel";
import { FiFilm, FiTv, FiCamera, FiChevronRight } from "react-icons/fi";
import Link from "next/link";

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

  return (
    <div className="min-h-screen bg-[oklch(0.1_0.005_45)]">
      {/* Hero Carousel */}
      {featured.length > 0 && <HeroCarousel titles={featured} />}

      {/* Quick Type Navigation */}
      <section className="border-b border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-6 py-4 md:px-8">
          <div className="flex items-center gap-6">
            <Link
              href="/catalog?type=MOVIE"
              className="group flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-amber"
            >
              <FiFilm className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="font-heading uppercase tracking-wider">Films</span>
            </Link>
            <Link
              href="/catalog?type=SERIES"
              className="group flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-amber"
            >
              <FiTv className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="font-heading uppercase tracking-wider">Series</span>
            </Link>
            <Link
              href="/catalog?type=DOCUMENTARY"
              className="group flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-amber"
            >
              <FiCamera className="h-4 w-4 transition-transform group-hover:scale-110" />
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
                <FiChevronRight className="h-4 w-4" />
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
