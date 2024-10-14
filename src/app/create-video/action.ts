"use server";

import type { ActionsReturn } from "@/hooks/useFormState";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getMostQualityThumb } from "@/utils/thumb";

const createVideoSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  youtubeId: z.string().min(1, "O id do vídeo do Youtube é obrigatório"),
});
export type CreateVideoKeys = keyof z.infer<typeof createVideoSchema>;

const objectError = (message: string) => {
  return {
    success: false,
    message,
    errors: null,
    data: null,
  };
};

export async function createVideoAction(
  data: FormData,
): ActionsReturn<CreateVideoKeys> {
  const result = createVideoSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors, data: null };
  }

  const user = await currentUser();
  if (!user) {
    return objectError("Você precisa estar logado para criar um vídeo!");
  }

  const { title, youtubeId } = result.data;

  try {
    const thumb = await getMostQualityThumb(youtubeId);
    if (!thumb) {
      return objectError("Houve um erro ao obter a thumbnail do vídeo!");
    }

    await prisma.video.create({
      data: {
        title,
        youtubeId,
        thumb,
        user: { connect: { externalId: user.id } },
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      let message = "Houve um erro ao criar o vídeo!";
      if (error.code === "P2025") {
        message = "Usuário não encontrado!";
      }
      return objectError(message);
    }

    if (error instanceof Error) {
      return objectError(error.message);
    }

    return objectError("Houve um erro ao criar o vídeo!");
  }

  return {
    success: true,
    message: "Vídeo criado com sucesso!",
    errors: null,
    data: null,
  };
}
