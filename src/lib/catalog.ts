import { prisma } from "@/lib/prisma";
import { TitleType } from "@prisma/client";

export interface CatalogFilters {
  search?: string;
  type?: TitleType;
  genreId?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface CatalogResult {
  titles: CatalogTitle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CatalogTitle {
  id: string;
  type: TitleType;
  title: string;
  synopsis: string | null;
  releaseYear: number | null;
  rating: string | null;
  duration: number | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  genres: { id: string; name: string; slug: string }[];
  categories: { id: string; name: string; slug: string }[];
}

export async function getCatalogTitles(filters: CatalogFilters = {}): Promise<CatalogResult> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    status: "PUBLISHED",
  };

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { synopsis: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.genreId) {
    where.genres = { some: { genreId: filters.genreId } };
  }

  if (filters.categoryId) {
    where.categories = { some: { categoryId: filters.categoryId } };
  }

  const [titles, total] = await Promise.all([
    prisma.title.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        genres: {
          include: { genre: true },
        },
        categories: {
          include: { category: true },
        },
      },
    }),
    prisma.title.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    titles: titles.map((t) => ({
      id: t.id,
      type: t.type,
      title: t.title,
      synopsis: t.synopsis,
      releaseYear: t.releaseYear,
      rating: t.rating,
      duration: t.duration,
      posterUrl: t.posterUrl,
      backdropUrl: t.backdropUrl,
      genres: t.genres.map((tg) => ({
        id: tg.genre.id,
        name: tg.genre.name,
        slug: tg.genre.slug,
      })),
      categories: t.categories.map((tc) => ({
        id: tc.category.id,
        name: tc.category.name,
        slug: tc.category.slug,
      })),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export async function getCatalogByCategory(): Promise<{ category: string; slug: string; titles: CatalogTitle[] }[]> {
  const categories = await prisma.category.findMany({
    include: {
      titles: {
        include: {
          title: {
            include: {
              genres: { include: { genre: true } },
              categories: { include: { category: true } },
            },
          },
        },
      },
    },
  });

  return categories.map((cat: { name: string; slug: string; titles: Array<{ title: { id: string; type: string; title: string; synopsis: string | null; releaseYear: number | null; rating: string | null; duration: number | null; posterUrl: string | null; backdropUrl: string | null; status: string; genres: Array<{ genre: { id: string; name: string; slug: string } }>; categories: Array<{ category: { id: string; name: string; slug: string } }> } | null }> }) => ({
    category: cat.name,
    slug: cat.slug,
    titles: cat.titles
      .filter((tc) => tc.title && tc.title.status === "PUBLISHED")
      .slice(0, 10)
      .map((tc) => ({
        id: tc.title!.id,
        type: tc.title!.type as TitleType,
        title: tc.title!.title,
        synopsis: tc.title!.synopsis,
        releaseYear: tc.title!.releaseYear,
        rating: tc.title!.rating,
        duration: tc.title!.duration,
        posterUrl: tc.title!.posterUrl,
        backdropUrl: tc.title!.backdropUrl,
        genres: tc.title!.genres.map((tg: { genre: { id: string; name: string; slug: string } }) => ({
          id: tg.genre.id,
          name: tg.genre.name,
          slug: tg.genre.slug,
        })),
        categories: tc.title!.categories.map((tc2: { category: { id: string; name: string; slug: string } }) => ({
          id: tc2.category.id,
          name: tc2.category.name,
          slug: tc2.category.slug,
        })),
      })),
  }));
}

export async function getGenres(): Promise<{ id: string; name: string; slug: string }[]> {
  const genres = await prisma.genre.findMany({
    orderBy: { name: "asc" },
  });
  return genres;
}

export async function getCategories(): Promise<{ id: string; name: string; slug: string }[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  return categories;
}

export async function getFeaturedTitles(limit: number = 5): Promise<CatalogTitle[]> {
  const titles = await prisma.title.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      genres: { include: { genre: true } },
      categories: { include: { category: true } },
    },
  });

  return titles.map((t) => ({
    id: t.id,
    type: t.type,
    title: t.title,
    synopsis: t.synopsis,
    releaseYear: t.releaseYear,
    rating: t.rating,
    duration: t.duration,
    posterUrl: t.posterUrl,
    backdropUrl: t.backdropUrl,
    genres: t.genres.map((tg) => ({
      id: tg.genre.id,
      name: tg.genre.name,
      slug: tg.genre.slug,
    })),
    categories: t.categories.map((tc) => ({
      id: tc.category.id,
      name: tc.category.name,
      slug: tc.category.slug,
    })),
  }));
}

export async function getRecentTitles(limit: number = 10): Promise<CatalogTitle[]> {
  const titles = await prisma.title.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      genres: { include: { genre: true } },
      categories: { include: { category: true } },
    },
  });

  return titles.map((t) => ({
    id: t.id,
    type: t.type,
    title: t.title,
    synopsis: t.synopsis,
    releaseYear: t.releaseYear,
    rating: t.rating,
    duration: t.duration,
    posterUrl: t.posterUrl,
    backdropUrl: t.backdropUrl,
    genres: t.genres.map((tg) => ({
      id: tg.genre.id,
      name: tg.genre.name,
      slug: tg.genre.slug,
    })),
    categories: t.categories.map((tc) => ({
      id: tc.category.id,
      name: tc.category.name,
      slug: tc.category.slug,
    })),
  }));
}
