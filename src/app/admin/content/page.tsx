import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Search, Pencil } from "lucide-react";

interface ContentPageProps {
  searchParams: Promise<{ search?: string; page?: string; type?: string }>;
}

export default async function ContentPage({ searchParams }: ContentPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { synopsis: { contains: params.search, mode: "insensitive" } },
    ];
  }
  if (params.type && params.type !== "all") {
    where.type = params.type;
  }

  const [titles, total] = await Promise.all([
    prisma.title.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        genres: { include: { genre: true } },
        _count: { select: { episodes: true, videoVersions: true } },
      },
    }),
    prisma.title.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl uppercase tracking-wider text-white">Content</h1>
        <Link
          href="/admin/content/new"
          className="flex items-center gap-2 rounded-sm bg-amber px-4 py-2 text-sm font-medium uppercase tracking-wider text-[oklch(0.1_0.005_45)] transition-colors hover:bg-amber/90"
        >
          <Plus className="h-4 w-4" />
          Add Title
        </Link>
      </div>

      {/* Search and filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <form>
            <input
              type="search"
              name="search"
              defaultValue={params.search}
              placeholder="Search titles..."
              className="w-full rounded-sm border border-zinc-700/50 bg-zinc-800/50 py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:border-amber/40 focus:outline-none focus:ring-1 focus:ring-amber/20"
            />
          </form>
        </div>
        <form>
          <select
            name="type"
            defaultValue={params.type ?? "all"}
            className="rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-amber/40 focus:outline-none focus:ring-1 focus:ring-amber/20"
          >
            <option value="all">All Types</option>
            <option value="MOVIE">Films</option>
            <option value="SERIES">Series</option>
            <option value="DOCUMENTARY">Documentaries</option>
          </select>
        </form>
      </div>

      {/* Content table */}
      <div className="overflow-hidden rounded-sm border border-zinc-800/50">
        <table className="w-full">
          <thead className="bg-zinc-800/30">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                Episodes
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                Year
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/30">
            {titles.map((title) => (
              <tr key={title.id} className="transition-colors hover:bg-zinc-800/20">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {title.posterUrl ? (
                      <img
                        src={title.posterUrl}
                        alt=""
                        className="h-10 w-7 rounded-sm object-cover ring-1 ring-zinc-700/50"
                      />
                    ) : (
                      <div className="h-10 w-7 rounded-sm bg-zinc-800" />
                    )}
                    <div>
                      <p className="font-medium text-zinc-200">{title.title}</p>
                      <p className="truncate text-xs text-zinc-500 max-w-xs">
                        {title.synopsis ?? "No synopsis"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-sm bg-zinc-800/50 px-2 py-0.5 text-xs text-zinc-400">
                    {title.type === "MOVIE" ? "Film" : title.type === "SERIES" ? "Series" : "Doc"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-sm px-2 py-0.5 text-xs ${
                      title.status === "PUBLISHED"
                        ? "bg-green-900/30 text-green-400"
                        : title.status === "PROCESSING"
                        ? "bg-yellow-900/30 text-yellow-400"
                        : "bg-zinc-800/50 text-zinc-500"
                    }`}
                  >
                    {title.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-zinc-400">
                  {title._count.episodes}
                </td>
                <td className="px-4 py-3 text-sm text-zinc-400">
                  {title.releaseYear ?? "-"}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/content/${title.id}`}
                      className="flex items-center gap-1 rounded-sm px-2 py-1 text-xs text-zinc-400 transition-colors hover:text-amber"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {titles.length === 0 && (
          <div className="py-12 text-center">
            <p className="font-heading text-sm uppercase tracking-wider text-zinc-500">No titles found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            Showing {skip + 1}-{Math.min(skip + limit, total)} of {total}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/content?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}
                className="rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:text-white"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/content?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
                className="rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:text-white"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
