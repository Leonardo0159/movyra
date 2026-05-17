import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getTitleById, getRelatedTitles, groupEpisodesBySeason } from "@/lib/titles";
import { BackdropHero } from "@/components/title/backdrop-hero";
import { CastList } from "@/components/title/cast-list";
import { EpisodeList } from "@/components/title/episode-list";
import { RelatedContent } from "@/components/title/related-content";

interface TitlePageProps {
  params: Promise<{ id: string }>;
}

export default async function TitlePage({ params }: TitlePageProps) {
  const { id } = await params;
  const title = await getTitleById(id);

  if (!title) {
    notFound();
  }

  const seasons = title.type === "SERIES" ? groupEpisodesBySeason(title.episodes) : [];
  const relatedTitles = title.genres.length > 0
    ? await getRelatedTitles(title.id, title.genres.map((g) => g.id))
    : [];

  return (
    <div className="min-h-screen bg-[oklch(0.1_0.005_45)]">
      <div className="absolute left-6 top-6 z-20 md:left-8">
        <Link
          href="/catalog"
          className="group flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-amber"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Catalog
        </Link>
      </div>

      <BackdropHero
        backdropUrl={title.backdropUrl}
        posterUrl={title.posterUrl}
        title={title.title}
        synopsis={title.synopsis}
        releaseYear={title.releaseYear}
        duration={title.duration}
        rating={title.rating}
        type={title.type.toLowerCase()}
        watchUrl={`/watch/${title.id}`}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">
        {title.genres.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {title.genres.map((genre) => (
              <Link
                key={genre.id}
                href={`/catalog?genreId=${genre.id}`}
                className="rounded-sm border border-zinc-700/50 bg-zinc-900/30 px-3 py-1 text-xs uppercase tracking-wider text-zinc-400 backdrop-blur-sm transition-all hover:border-amber/30 hover:text-amber"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        )}

        <CastList castMembers={title.castMembers} />

        {title.type === "SERIES" && seasons.length > 0 && (
          <EpisodeList seasons={seasons} titleId={title.id} />
        )}

        <RelatedContent titles={relatedTitles} />
      </div>
    </div>
  );
}
