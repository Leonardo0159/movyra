import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TitleForm } from "@/components/admin/title-form";

interface EditTitlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTitlePage({ params }: EditTitlePageProps) {
  const { id } = await params;

  const title = await prisma.title.findUnique({
    where: { id },
    include: {
      genres: true,
      categories: true,
      castMembers: true,
      episodes: {
        orderBy: [{ seasonNumber: "asc" }, { episodeNumber: "asc" }],
      },
    },
  });

  if (!title) {
    notFound();
  }

  const [genres, categories, castMembers] = await Promise.all([
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.castMember.findMany({ orderBy: { name: "asc" } }),
  ]);

  const initialData = {
    id: title.id,
    type: title.type,
    title: title.title,
    synopsis: title.synopsis ?? "",
    releaseYear: title.releaseYear?.toString() ?? "",
    rating: title.rating ?? "",
    duration: title.duration?.toString() ?? "",
    posterUrl: title.posterUrl ?? "",
    backdropUrl: title.backdropUrl ?? "",
    genreIds: title.genres.map((g) => g.genreId),
    categoryIds: title.categories.map((c) => c.categoryId),
    castMembers: title.castMembers.map((cm) => ({
      castMemberId: cm.castMemberId,
      characterName: cm.characterName ?? "",
      order: cm.order,
    })),
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 font-heading text-2xl uppercase tracking-wider text-white">Edit: {title.title}</h1>
      <TitleForm
        initialData={initialData}
        genres={genres}
        categories={categories}
        castMembers={castMembers}
        isEdit
      />

      {/* Episode management for series */}
      {title.type === "SERIES" && (
        <div className="mt-8 rounded-sm border border-zinc-800/50 bg-zinc-900/30 p-6 backdrop-blur-sm">
          <h2 className="mb-4 font-heading text-lg uppercase tracking-wider text-white">Episodes</h2>
          <p className="text-sm text-zinc-500">
            {title.episodes.length} episode(s)
          </p>
          <div className="mt-4 space-y-2">
            {title.episodes.map((ep) => (
              <div key={ep.id} className="flex items-center justify-between rounded-sm bg-zinc-800/30 p-3">
                <div>
                  <p className="text-sm font-medium text-zinc-200">
                    S{ep.seasonNumber} E{ep.episodeNumber}: {ep.name}
                  </p>
                  {ep.duration && (
                    <p className="text-xs text-zinc-500">{ep.duration} minutes</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
