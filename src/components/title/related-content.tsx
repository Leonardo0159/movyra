import { TitleCard } from "@/components/catalog/title-card";
import { TitleDetails } from "@/lib/titles";

interface RelatedContentProps {
  titles: TitleDetails[];
}

export function RelatedContent({ titles }: RelatedContentProps) {
  if (titles.length === 0) return null;

  return (
    <section className="py-8" aria-labelledby="related-heading">
      <div className="mb-5 flex items-end gap-3">
        <h2 id="related-heading" className="text-2xl font-heading uppercase tracking-wider text-white md:text-3xl">
          More Like This
        </h2>
        <div className="h-px flex-1 bg-zinc-800/50" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {titles.map((title) => (
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
    </section>
  );
}
