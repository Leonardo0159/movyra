import { Suspense } from "react";
import { getCatalogTitles, getCatalogByCategory, getGenres, getCategories } from "@/lib/catalog";
import { CategoryRow } from "@/components/catalog/category-row";
import { FilterBar } from "@/components/catalog/filter-bar";
import { SearchInput } from "@/components/catalog/search-input";
import { TitleCard } from "@/components/catalog/title-card";

interface CatalogPageProps {
  searchParams: Promise<{
    search?: string;
    type?: string;
    genreId?: string;
    categoryId?: string;
    page?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const hasFilters = params.search || params.type || params.genreId || params.categoryId;

  if (hasFilters) {
    return (
      <Suspense fallback={<CatalogSkeleton />}>
        <FilteredCatalog params={params} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <DefaultCatalog />
    </Suspense>
  );
}

async function FilteredCatalog({ params }: { params: Awaited<CatalogPageProps["searchParams"]> }) {
  const [result, genres, categories] = await Promise.all([
    getCatalogTitles({
      search: params.search,
      type: params.type as "MOVIE" | "SERIES" | "DOCUMENTARY" | undefined,
      genreId: params.genreId,
      categoryId: params.categoryId,
      page: params.page ? parseInt(params.page, 10) : 1,
    }),
    getGenres(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-[oklch(0.1_0.005_45)]">
      <div className="border-b border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-6 py-5 md:px-8">
          <h1 className="mb-4 font-heading text-3xl uppercase tracking-wider text-white md:text-4xl">
            {params.search ? `Results for "${params.search}"` : "Browse"}
          </h1>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput />
            <FilterBar genres={genres} categories={categories} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-8">
        {result.titles.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-heading text-lg uppercase tracking-wider text-zinc-500">No titles found</p>
            <p className="mt-2 text-sm text-zinc-600">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-zinc-500">{result.pagination.total} titles</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {result.titles.map((title) => (
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
            {result.pagination.hasNext && (
              <div className="mt-10 flex justify-center">
                <a
                  href={`/catalog?${new URLSearchParams({ ...params, page: String(result.pagination.page + 1) }).toString()}`}
                  className="rounded-sm border border-zinc-700/50 bg-zinc-900/50 px-6 py-2.5 text-sm font-medium uppercase tracking-wider text-zinc-300 backdrop-blur-sm transition-all hover:border-amber/30 hover:text-amber"
                >
                  Load More
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

async function DefaultCatalog() {
  const [categoryData, genres, categories] = await Promise.all([
    getCatalogByCategory(),
    getGenres(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-[oklch(0.1_0.005_45)]">
      <div className="border-b border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-6 py-5 md:px-8">
          <h1 className="mb-4 font-heading text-3xl uppercase tracking-wider text-white md:text-4xl">
            Browse
          </h1>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput />
            <FilterBar genres={genres} categories={categories} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        {categoryData.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-heading text-lg uppercase tracking-wider text-zinc-500">No content available yet</p>
          </div>
        ) : (
          categoryData.map((cat) => (
            <CategoryRow key={cat.slug} category={cat.category} titles={cat.titles} />
          ))
        )}
      </div>
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="min-h-screen bg-[oklch(0.1_0.005_45)]">
      <div className="border-b border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-6 py-5 md:px-8">
          <div className="mb-4 h-9 w-40 animate-pulse rounded bg-zinc-800" />
          <div className="flex gap-4">
            <div className="h-10 w-64 animate-pulse rounded-sm bg-zinc-800" />
            <div className="h-10 w-24 animate-pulse rounded-sm bg-zinc-800" />
          </div>
        </div>
      </div>
      <div className="px-6 py-8 md:px-8">
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-44 flex-shrink-0">
              <div className="aspect-[2/3] animate-pulse rounded-sm bg-zinc-800" />
              <div className="mt-2.5 h-4 w-32 animate-pulse rounded bg-zinc-800" />
              <div className="mt-1 h-3 w-20 animate-pulse rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
