import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/admin-middleware";

export async function POST(request: NextRequest) {
  const auth = await verifyAdminToken(request);
  if ("status" in auth) return auth;

  try {
    const body = await request.json();
    const {
      type,
      title,
      synopsis,
      releaseYear,
      rating,
      duration,
      posterUrl,
      backdropUrl,
      genreIds,
      categoryIds,
      castMembers,
    } = body;

    if (!type || !title) {
      return NextResponse.json(
        { error: "Type and title are required" },
        { status: 400 }
      );
    }

    const newTitle = await prisma.title.create({
      data: {
        type,
        title,
        synopsis: synopsis || null,
        releaseYear: releaseYear ? parseInt(releaseYear, 10) : null,
        rating: rating || null,
        duration: duration ? parseInt(duration, 10) : null,
        posterUrl: posterUrl || null,
        backdropUrl: backdropUrl || null,
        genres: genreIds?.length
          ? { create: genreIds.map((id: string) => ({ genre: { connect: { id } } })) }
          : undefined,
        categories: categoryIds?.length
          ? { create: categoryIds.map((id: string) => ({ category: { connect: { id } } })) }
          : undefined,
        castMembers: castMembers?.length
          ? {
              create: castMembers.map((cm: { castMemberId: string; characterName: string; order: number }) => ({
                castMember: { connect: { id: cm.castMemberId } },
                characterName: cm.characterName || null,
                order: cm.order || 0,
              })),
            }
          : undefined,
      },
    });

    return NextResponse.json(newTitle, { status: 201 });
  } catch (error) {
    console.error("Create title error:", error);
    return NextResponse.json(
      { error: "Failed to create title" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const auth = await verifyAdminToken(request);
  if ("status" in auth) return auth;

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "20", 10);
    const search = searchParams.get("search") ?? undefined;
    const type = searchParams.get("type") ?? undefined;

    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { synopsis: { contains: search, mode: "insensitive" } },
      ];
    }
    if (type) {
      where.type = type;
    }

    const [titles, total] = await Promise.all([
      prisma.title.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          genres: { include: { genre: true } },
          categories: { include: { category: true } },
          _count: { select: { episodes: true, videoVersions: true } },
        },
      }),
      prisma.title.count({ where }),
    ]);

    return NextResponse.json({
      titles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List titles error:", error);
    return NextResponse.json(
      { error: "Failed to fetch titles" },
      { status: 500 }
    );
  }
}
