import { TitleCard } from "./title-card";
import { CatalogTitle } from "@/lib/catalog";

interface CategoryRowProps {
  category: string;
  titles: CatalogTitle[];
}

export function CategoryRow({ category, titles }: CategoryRowProps) {
  if (titles.length === 0) return null;

  return (
    <section className="py-6" aria-labelledby={`category-${category}`}>
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-4 flex items-end gap-3">
          <h2
            id={`category-${category}`}
            className="text-2xl font-heading uppercase tracking-wider text-white md:text-3xl"
          >
            {category}
          </h2>
          <div className="h-px flex-1 bg-zinc-800/50" />
        </div>
      </div>
      <div
        className="flex gap-4 overflow-x-auto px-6 pb-3 scrollbar-hide md:px-8"
        role="list"
        aria-label={`${category} titles`}
      >
        {titles.map((title) => (
          <div key={title.id} role="listitem">
            <TitleCard
              id={title.id}
              type={title.type}
              title={title.title}
              releaseYear={title.releaseYear}
              rating={title.rating}
              posterUrl={title.posterUrl}
              genres={title.genres}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
