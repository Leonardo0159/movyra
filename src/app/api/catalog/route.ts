import { NextRequest, NextResponse } from "next/server";
import { getCatalogTitles, getGenres, getCategories } from "@/lib/catalog";
import { TitleType } from "@prisma/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action");

  if (action === "filters") {
    const [genres, categories] = await Promise.all([getGenres(), getCategories()]);
    return NextResponse.json({ genres, categories });
  }

  const search = searchParams.get("search") ?? undefined;
  const type = searchParams.get("type") as TitleType | undefined;
  const genreId = searchParams.get("genreId") ?? undefined;
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);

  try {
    const result = await getCatalogTitles({
      search,
      type: type ? validateTitleType(type) : undefined,
      genreId,
      categoryId,
      page: isNaN(page) ? 1 : page,
      limit: isNaN(limit) ? 20 : limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Catalog API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch catalog" },
      { status: 500 }
    );
  }
}

function validateTitleType(type: string): TitleType | undefined {
  if (Object.values(TitleType).includes(type as TitleType)) {
    return type as TitleType;
  }
  return undefined;
}
