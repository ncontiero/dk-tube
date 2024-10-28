"use server";

import type { ActionsReturn } from "@/hooks/useFormState";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updatePlaylistSchema = z.object({
  playlistId: z.string().min(1, "ID da playlist é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  isPublic: z
    .string()
    .default("off")
    .transform((value) => value === "on"),
});
export type UpdatePlaylistKeys = keyof z.infer<typeof updatePlaylistSchema>;

const objectError = (message: string) => {
  return {
    success: false,
    message,
    errors: null,
    data: null,
  };
};

export async function updatePlaylistAction(
  data: FormData,
): ActionsReturn<UpdatePlaylistKeys> {
  const result = updatePlaylistSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors, data: null };
  }

  const user = await currentUser();
  if (!user) {
    return objectError("Você precisa estar logado para editar uma playlist!");
  }

  try {
    const { playlistId, name, isPublic } = result.data;

    await prisma.playlist.update({
      where: { id: playlistId },
      data: {
        name,
        isPublic,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      let message = "Houve um erro ao atualizar a playlist!";
      if (error.code === "P2025") {
        message = "Usuário não encontrado!";
      }
      return objectError(message);
    }

    if (error instanceof Error) {
      return objectError(error.message);
    }

    return objectError("Houve um erro ao atualizar a playlist!");
  }

  return {
    success: true,
    message: "Playlist atualizada com sucesso!",
    errors: null,
    data: null,
  };
}
