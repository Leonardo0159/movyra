"use server";

// Ações de servidor para gerenciamento de upload de filmes
// Responsável por criar e atualizar títulos no banco de dados

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { env } from "@/lib/env";

// Interface para o payload do JWT
interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

// Verifica se o usuário é administrador
async function verifyAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return false;

  try {
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const { payload } = await jwtVerify(accessToken, secret);
    return (payload as unknown as JWTPayload).role === "ADMIN";
  } catch {
    return false;
  }
}

// Schemas de validação Zod para Server Actions
const CreateTitleSchema = z.object({
  type: z.enum(["MOVIE", "SERIES", "DOCUMENTARY"]),
  title: z.string().trim().min(1, "Title is required").max(255),
  synopsis: z.string().trim().max(5000).optional().or(z.literal("")),
  releaseYear: z.number().int().min(1800).max(new Date().getFullYear() + 5).optional(),
  rating: z.string().trim().max(10).optional().or(z.literal("")),
  duration: z.number().int().positive().optional(),
  genreIds: z.array(z.string().uuid()).optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
});

const UpdateTitleAfterEncodingSchema = z.object({
  titleId: z.string().uuid(),
  videoVersions: z.array(
    z.object({
      resolution: z.enum(["360p", "480p", "720p", "1080p", "4K"]),
      bitrate: z.number().int().positive().optional(),
      hlsManifestUrl: z.string().url().optional().or(z.literal("")),
      storageKey: z.string().min(1).max(500),
      duration: z.number().int().positive().optional(),
    })
  ),
});

// Dados necessários para criar um título
interface CreateTitleInput {
  type: "MOVIE" | "SERIES" | "DOCUMENTARY";
  title: string;
  synopsis?: string;
  releaseYear?: number;
  rating?: string;
  duration?: number;
  genreIds?: string[];
  categoryIds?: string[];
}

// Resultado padronizado das ações de servidor
interface ServerActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Cria um novo título com metadados e status PROCESSING
export async function createTitleWithMetadata(
  input: CreateTitleInput
): Promise<ServerActionResult<{ id: string }>> {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return { success: false, error: "Unauthorized" };
    }

    const parsed = CreateTitleSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const { data } = parsed;

    const newTitle = await prisma.title.create({
      data: {
        type: data.type,
        title: data.title,
        synopsis: data.synopsis || null,
        releaseYear: data.releaseYear || null,
        rating: data.rating || null,
        duration: data.duration || null,
        status: "PROCESSING",
        genres: data.genreIds?.length
          ? { create: data.genreIds.map((id) => ({ genre: { connect: { id } } })) }
          : undefined,
        categories: data.categoryIds?.length
          ? { create: data.categoryIds.map((id) => ({ category: { connect: { id } } })) }
          : undefined,
      },
    });

    revalidatePath("/admin/content");

    return { success: true, data: { id: newTitle.id } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Create title error:", message);
    return { success: false, error: "Failed to create title" };
  }
}

// Dados para atualizar o título após codificação
interface UpdateTitleAfterEncodingInput {
  titleId: string;
  videoVersions: {
    resolution: string;
    bitrate?: number;
    hlsManifestUrl?: string;
    storageKey?: string;
    duration?: number;
  }[];
}

// Atualiza o título após a codificação do vídeo ser concluída
export async function updateTitleAfterEncoding(
  input: UpdateTitleAfterEncodingInput
): Promise<ServerActionResult<void>> {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return { success: false, error: "Unauthorized" };
    }

    const parsed = UpdateTitleAfterEncodingSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const { data } = parsed;

    await prisma.title.update({
      where: { id: data.titleId },
      data: {
        status: "PUBLISHED",
        videoVersions: {
          create: data.videoVersions.map((v) => ({
            resolution: v.resolution,
            bitrate: v.bitrate || null,
            hlsManifestUrl: v.hlsManifestUrl || null,
            storageKey: v.storageKey,
            duration: v.duration || null,
          })),
        },
      },
    });

    revalidatePath("/admin/content");
    revalidatePath(`/admin/content/${data.titleId}`);

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Update title after encoding error:", message);
    return { success: false, error: "Failed to update title after encoding" };
  }
}
