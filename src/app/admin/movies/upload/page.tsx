import { prisma } from "@/lib/prisma";
import { MovieUploadForm } from "@/components/admin/movie-upload-form";

export default async function MovieUploadPage() {
  const [genres, categories] = await Promise.all([
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="p-6">
      <h1 className="mb-6 font-heading text-2xl uppercase tracking-wider text-white">Upload Movie</h1>
      <MovieUploadForm
        genres={genres}
        categories={categories}
      />
    </div>
  );
}
