import { prisma } from "@/lib/prisma";
import { TitleForm } from "@/components/admin/title-form";

export default async function NewTitlePage() {
  const [genres, categories, castMembers] = await Promise.all([
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.castMember.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="p-6">
      <h1 className="mb-6 font-heading text-2xl uppercase tracking-wider text-white">Add New Title</h1>
      <TitleForm
        genres={genres}
        categories={categories}
        castMembers={castMembers}
      />
    </div>
  );
}
