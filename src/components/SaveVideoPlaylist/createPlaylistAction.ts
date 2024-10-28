"use server";

import type { ActionsReturn } from "@/hooks/useFormState";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma, prismaSkip } from "@/lib/prisma";

const createPlaylistSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  videoId: z.string().optional(),
  isPublic: z
    .string()
    .default("off")
    .transform((value) => value === "on"),
});
export type CreatePlaylistKeys = keyof z.infer<typeof createPlaylistSchema>;

const objectError = (message: string) => {
  return {
    success: false,
    message,
    errors: null,
    data: null,
  };
};

export async function createPlaylistAction(
  data: FormData,
): ActionsReturn<CreatePlaylistKeys> {
  const result = createPlaylistSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors, data: null };
  }

  const user = await currentUser();
  if (!user) {
    return objectError("Você precisa estar logado para criar uma playlist!");
  }

  try {
    const { name, videoId, isPublic } = result.data;

    await prisma.playlist.create({
      data: {
        name,
        user: { connect: { externalId: user.id } },
        videos: { connect: { id: videoId || prismaSkip } },
        isPublic,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      let message = "Houve um erro ao criar a playlist!";
      if (error.code === "P2025") {
        message = "Usuário não encontrado!";
      }
      return objectError(message);
    }

    if (error instanceof Error) {
      return objectError(error.message);
    }

    return objectError("Houve um erro ao criar a playlist!");
  }

  return {
    success: true,
    message: "Playlist criada com sucesso!",
    errors: null,
    data: null,
  };
}
