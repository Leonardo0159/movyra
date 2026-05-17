import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/admin-middleware";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminToken(request);
  if ("status" in auth) return auth;

  try {
    const { id } = await params;
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

    const existing = await prisma.title.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Title not found" }, { status: 404 });
    }

    const updated = await prisma.title.update({
      where: { id },
      data: {
        type: type ?? existing.type,
        title: title ?? existing.title,
        synopsis: synopsis !== undefined ? synopsis : existing.synopsis,
        releaseYear: releaseYear !== undefined ? (releaseYear ? parseInt(releaseYear, 10) : null) : existing.releaseYear,
        rating: rating !== undefined ? rating : existing.rating,
        duration: duration !== undefined ? (duration ? parseInt(duration, 10) : null) : existing.duration,
        posterUrl: posterUrl !== undefined ? posterUrl : existing.posterUrl,
        backdropUrl: backdropUrl !== undefined ? backdropUrl : existing.backdropUrl,
      },
    });

    // Update genres
    if (genreIds !== undefined) {
      await prisma.titleGenre.deleteMany({ where: { titleId: id } });
      if (genreIds.length > 0) {
        await prisma.titleGenre.createMany({
          data: genreIds.map((genreId: string) => ({ titleId: id, genreId })),
        });
      }
    }

    // Update categories
    if (categoryIds !== undefined) {
      await prisma.titleCategory.deleteMany({ where: { titleId: id } });
      if (categoryIds.length > 0) {
        await prisma.titleCategory.createMany({
          data: categoryIds.map((categoryId: string) => ({ titleId: id, categoryId })),
        });
      }
    }

    // Update cast members
    if (castMembers !== undefined) {
      await prisma.titleCastMember.deleteMany({ where: { titleId: id } });
      if (castMembers.length > 0) {
        await prisma.titleCastMember.createMany({
          data: castMembers.map((cm: { castMemberId: string; characterName: string; order: number }) => ({
            titleId: id,
            castMemberId: cm.castMemberId,
            characterName: cm.characterName || null,
            order: cm.order || 0,
          })),
        });
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update title error:", error);
    return NextResponse.json(
      { error: "Failed to update title" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminToken(request);
  if ("status" in auth) return auth;

  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const softDelete = searchParams.get("soft") !== "false";

    const existing = await prisma.title.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Title not found" }, { status: 404 });
    }

    if (softDelete) {
      await prisma.title.update({
        where: { id },
        data: { status: "ARCHIVED" },
      });
    } else {
      await prisma.title.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete title error:", error);
    return NextResponse.json(
      { error: "Failed to delete title" },
      { status: 500 }
    );
  }
}
