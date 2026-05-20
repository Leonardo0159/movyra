import { prisma } from "@/lib/prisma";

export async function getWatchHistory(profileId: string, titleId: string, episodeId?: string) {
  return prisma.watchHistory.findFirst({
    where: {
      profileId,
      titleId,
      episodeId: episodeId ?? undefined,
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function saveWatchHistory(
  profileId: string,
  titleId: string,
  episodeId: string | undefined,
  progress: number
) {
  return prisma.watchHistory.upsert({
    where: {
      profileId_titleId_episodeId: {
        profileId,
        titleId,
        episodeId: episodeId ?? "",
      },
    },
    create: {
      profileId,
      titleId,
      episodeId: episodeId ?? undefined,
      progress,
    },
    update: {
      progress,
      updatedAt: new Date(),
    },
  });
}
