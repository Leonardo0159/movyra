import { prisma } from "@/lib/prisma";
import { TitleType } from "@prisma/client";

export interface TitleDetails {
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
  castMembers: {
    id: string;
    name: string;
    role: string | null;
    imageUrl: string | null;
    characterName: string | null;
    order: number;
  }[];
  episodes: {
    id: string;
    seasonNumber: number;
    episodeNumber: number;
    name: string;
    synopsis: string | null;
    duration: number | null;
  }[];
  videoVersions: {
    id: string;
    resolution: string;
    bitrate: number | null;
    hlsManifestUrl: string | null;
  }[];
}

export interface SeasonGroup {
  seasonNumber: number;
  episodes: TitleDetails["episodes"];
}

export async function getTitleById(id: string): Promise<TitleDetails | null> {
  const title = await prisma.title.findUnique({
    where: { id },
    include: {
      genres: { include: { genre: true } },
      categories: { include: { category: true } },
      castMembers: {
        include: { castMember: true },
        orderBy: { order: "asc" },
      },
      episodes: {
        orderBy: [{ seasonNumber: "asc" }, { episodeNumber: "asc" }],
      },
      videoVersions: {
        orderBy: { resolution: "desc" },
      },
    },
  });

  if (!title) return null;

  return {
    id: title.id,
    type: title.type,
    title: title.title,
    synopsis: title.synopsis,
    releaseYear: title.releaseYear,
    rating: title.rating,
    duration: title.duration,
    posterUrl: title.posterUrl,
    backdropUrl: title.backdropUrl,
    genres: title.genres.map((g) => ({
      id: g.genre.id,
      name: g.genre.name,
      slug: g.genre.slug,
    })),
    categories: title.categories.map((c) => ({
      id: c.category.id,
      name: c.category.name,
      slug: c.category.slug,
    })),
    castMembers: title.castMembers.map((cm) => ({
      id: cm.castMember.id,
      name: cm.castMember.name,
      role: cm.castMember.role,
      imageUrl: cm.castMember.imageUrl,
      characterName: cm.characterName,
      order: cm.order,
    })),
    episodes: title.episodes.map((e) => ({
      id: e.id,
      seasonNumber: e.seasonNumber,
      episodeNumber: e.episodeNumber,
      name: e.name,
      synopsis: e.synopsis,
      duration: e.duration,
    })),
    videoVersions: title.videoVersions.map((v) => ({
      id: v.id,
      resolution: v.resolution,
      bitrate: v.bitrate,
      hlsManifestUrl: v.hlsManifestUrl,
    })),
  };
}

export async function getRelatedTitles(id: string, genreIds: string[], limit: number = 6): Promise<TitleDetails[]> {
  const titles = await prisma.title.findMany({
    where: {
      id: { not: id },
      status: "PUBLISHED",
      genres: { some: { genreId: { in: genreIds } } },
    },
    include: {
      genres: { include: { genre: true } },
      categories: { include: { category: true } },
      castMembers: { include: { castMember: true }, orderBy: { order: "asc" } },
      episodes: { orderBy: [{ seasonNumber: "asc" }, { episodeNumber: "asc" }] },
      videoVersions: { orderBy: { resolution: "desc" } },
    },
    take: limit,
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
    genres: t.genres.map((g) => ({ id: g.genre.id, name: g.genre.name, slug: g.genre.slug })),
    categories: t.categories.map((c) => ({ id: c.category.id, name: c.category.name, slug: c.category.slug })),
    castMembers: t.castMembers.map((cm) => ({
      id: cm.castMember.id,
      name: cm.castMember.name,
      role: cm.castMember.role,
      imageUrl: cm.castMember.imageUrl,
      characterName: cm.characterName,
      order: cm.order,
    })),
    episodes: t.episodes.map((e) => ({
      id: e.id,
      seasonNumber: e.seasonNumber,
      episodeNumber: e.episodeNumber,
      name: e.name,
      synopsis: e.synopsis,
      duration: e.duration,
    })),
    videoVersions: t.videoVersions.map((v) => ({
      id: v.id,
      resolution: v.resolution,
      bitrate: v.bitrate,
      hlsManifestUrl: v.hlsManifestUrl,
    })),
  }));
}

export function groupEpisodesBySeason(episodes: TitleDetails["episodes"]): SeasonGroup[] {
  const seasons = new Map<number, TitleDetails["episodes"]>();
  for (const episode of episodes) {
    const existing = seasons.get(episode.seasonNumber) ?? [];
    existing.push(episode);
    seasons.set(episode.seasonNumber, existing);
  }
  return Array.from(seasons.entries())
    .sort(([a], [b]) => a - b)
    .map(([seasonNumber, episodes]) => ({ seasonNumber, episodes }));
}
