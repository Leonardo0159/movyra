import "dotenv/config";
import { TitleType, TitleStatus } from "@prisma/client";
import { hash } from "bcrypt";
import { prisma } from "../src/lib/prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Cannot seed production database");
  }

  // Create categories
  const categories = [
    { name: "Movies", slug: "movies" },
    { name: "Series", slug: "series" },
    { name: "Documentaries", slug: "documentaries" },
    { name: "Anime", slug: "anime" },
    { name: "Kids", slug: "kids" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Create genres
  const genres = [
    { name: "Action", slug: "action" },
    { name: "Comedy", slug: "comedy" },
    { name: "Drama", slug: "drama" },
    { name: "Horror", slug: "horror" },
    { name: "Sci-Fi", slug: "sci-fi" },
    { name: "Romance", slug: "romance" },
    { name: "Thriller", slug: "thriller" },
    { name: "Animation", slug: "animation" },
    { name: "Adventure", slug: "adventure" },
    { name: "Fantasy", slug: "fantasy" },
    { name: "Mystery", slug: "mystery" },
    { name: "Crime", slug: "crime" },
  ];

  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { slug: genre.slug },
      update: {},
      create: genre,
    });
  }

  // Create cast members
  const castMembers = [
    { name: "Anna Smith", role: "Actor", imageUrl: null },
    { name: "John Doe", role: "Actor", imageUrl: null },
    { name: "Jane Director", role: "Director", imageUrl: null },
  ];

  for (const member of castMembers) {
    await prisma.castMember.upsert({
      where: { name: member.name },
      update: {},
      create: member,
    });
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

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: await hash("admin_password_123", 12),
      role: "ADMIN",
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

  // Fetch categories and genres for relations
  const moviesCategory = await prisma.category.findUnique({ where: { slug: "movies" } });
  const seriesCategory = await prisma.category.findUnique({ where: { slug: "series" } });
  const documentariesCategory = await prisma.category.findUnique({ where: { slug: "documentaries" } });

  const actionGenre = await prisma.genre.findUnique({ where: { slug: "action" } });
  const comedyGenre = await prisma.genre.findUnique({ where: { slug: "comedy" } });
  const dramaGenre = await prisma.genre.findUnique({ where: { slug: "drama" } });
  const scifiGenre = await prisma.genre.findUnique({ where: { slug: "sci-fi" } });
  const animationGenre = await prisma.genre.findUnique({ where: { slug: "animation" } });
  const adventureGenre = await prisma.genre.findUnique({ where: { slug: "adventure" } });
  const fantasyGenre = await prisma.genre.findUnique({ where: { slug: "fantasy" } });

  const annaSmith = await prisma.castMember.findUnique({ where: { name: "Anna Smith" } });
  const johnDoe = await prisma.castMember.findUnique({ where: { name: "John Doe" } });
  const janeDirector = await prisma.castMember.findUnique({ where: { name: "Jane Director" } });

  // Create titles with full relations
  await prisma.title.upsert({
    where: { id: "title-001" },
    update: {},
    create: {
      id: "title-001",
      type: TitleType.MOVIE,
      title: "Big Buck Bunny",
      synopsis: "A large and lovable rabbit deals with three tiny bullies in this animated short film.",
      releaseYear: 2008,
      rating: "G",
      duration: 10,
      posterUrl: "/posters/big-buck-bunny.jpg",
      backdropUrl: "/backdrops/big-buck-bunny.jpg",
      status: TitleStatus.PUBLISHED,
      categories: {
        create: [
          { category: { connect: { id: moviesCategory!.id } } },
          { category: { connect: { id: documentariesCategory!.id } } },
        ],
      },
      genres: {
        create: [
          { genre: { connect: { id: animationGenre!.id } } },
          { genre: { connect: { id: comedyGenre!.id } } },
        ],
      },
      castMembers: {
        create: [
          { castMember: { connect: { id: janeDirector!.id } }, characterName: null, order: 0 },
        ],
      },
    },
  });

  const series1 = await prisma.title.upsert({
    where: { id: "title-002" },
    update: {},
    create: {
      id: "title-002",
      type: TitleType.SERIES,
      title: "Sintel",
      synopsis: "A young girl named Sintel and her pet dragon embark on a quest for revenge.",
      releaseYear: 2010,
      rating: "PG",
      posterUrl: "/posters/sintel.jpg",
      backdropUrl: "/backdrops/sintel.jpg",
      status: TitleStatus.PUBLISHED,
      categories: {
        create: [
          { category: { connect: { id: seriesCategory!.id } } },
        ],
      },
      genres: {
        create: [
          { genre: { connect: { id: animationGenre!.id } } },
          { genre: { connect: { id: adventureGenre!.id } } },
          { genre: { connect: { id: fantasyGenre!.id } } },
        ],
      },
      castMembers: {
        create: [
          { castMember: { connect: { id: annaSmith!.id } }, characterName: "Sintel", order: 0 },
          { castMember: { connect: { id: johnDoe!.id } }, characterName: "Dragon", order: 1 },
        ],
      },
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
      synopsis: "Sintel's journey begins.",
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
      synopsis: "Sintel meets her loyal companion.",
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
