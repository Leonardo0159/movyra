import { PrismaClient, TitleType } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Cannot seed production database");
  }

  // Create users
  const user1 = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Demo User",
      password: await hash("demo_password_123", 12),
    },
  });

  // Create profiles
  await prisma.profile.upsert({
    where: { id: "profile-001" },
    update: {},
    create: {
      id: "profile-001",
      name: "Kids",
      userId: user1.id,
    },
  });

  await prisma.profile.upsert({
    where: { id: "profile-002" },
    update: {},
    create: {
      id: "profile-002",
      name: "Adults",
      userId: user1.id,
    },
  });

  // Create titles
  await prisma.title.upsert({
    where: { id: "title-001" },
    update: {},
    create: {
      id: "title-001",
      type: TitleType.MOVIE,
      title: "Big Buck Bunny",
      description: "A large and lovable rabbit deals with three tiny bullies in this animated short film.",
      releaseYear: 2008,
      rating: "G",
      duration: 10,
      thumbnailUrl: "/thumbnails/big-buck-bunny.jpg",
    },
  });

  const series1 = await prisma.title.upsert({
    where: { id: "title-002" },
    update: {},
    create: {
      id: "title-002",
      type: TitleType.SERIES,
      title: "Sintel",
      description: "A young girl named Sintel and her pet dragon embark on a quest for revenge.",
      releaseYear: 2010,
      rating: "PG",
      thumbnailUrl: "/thumbnails/sintel.jpg",
    },
  });

  // Create episodes for the series
  await prisma.episode.upsert({
    where: { id: "episode-001" },
    update: {},
    create: {
      id: "episode-001",
      titleId: series1.id,
      seasonNumber: 1,
      episodeNumber: 1,
      name: "The Beginning",
      description: "Sintel's journey begins.",
      duration: 15,
    },
  });

  await prisma.episode.upsert({
    where: { id: "episode-002" },
    update: {},
    create: {
      id: "episode-002",
      titleId: series1.id,
      seasonNumber: 1,
      episodeNumber: 2,
      name: "The Dragon",
      description: "Sintel meets her loyal companion.",
      duration: 18,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
