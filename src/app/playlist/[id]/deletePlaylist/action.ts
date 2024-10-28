"use server";

import type { ActionsReturn } from "@/hooks/useFormState";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const deletePlaylistSchema = z.object({
  playlistId: z.string().min(1, "ID da playlist é obrigatório"),
});
export type DeletePlaylistKeys = keyof z.infer<typeof deletePlaylistSchema>;

const objectError = (message: string) => {
  return {
    success: false,
    message,
    errors: null,
    data: null,
  };
};

export async function deletePlaylistAction(
  data: FormData,
): ActionsReturn<DeletePlaylistKeys> {
  const result = deletePlaylistSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors, data: null };
  }

  const user = await currentUser();
  if (!user) {
    return objectError("Você precisa estar logado para editar uma playlist!");
  }

  try {
    const { playlistId } = result.data;

    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId, user: { externalId: user.id } },
    });

    if (!playlist) {
      return objectError("Playlist não encontrada!");
    }

    await prisma.playlist.delete({
      where: { id: playlist.id, user: { externalId: user.id } },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      let message = "Houve um erro ao deletar a playlist!";
      if (error.code === "P2025") {
        message = "Usuário não encontrado!";
      }
      return objectError(message);
    }

    if (error instanceof Error) {
      return objectError(error.message);
    }

    return objectError("Houve um erro ao deletar a playlist!");
  }

  return {
    success: true,
    message: "Playlist deletada com sucesso!",
    errors: null,
    data: null,
  };
}
