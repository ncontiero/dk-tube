"use server";

import type { ActionsReturn } from "@/hooks/useFormState";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const objectError = (message: string) => {
  return {
    success: false,
    message,
    errors: null,
    data: null,
  };
};

export async function deleteHistoryAction(): ActionsReturn<string> {
  const user = await currentUser();
  if (!user) {
    return objectError("Você precisa estar logado!");
  }

  try {
    const history = await prisma.historyVideo.findMany({
      where: { user: { externalId: user.id } },
    });

    if (!history) {
      return objectError("Histórico não encontrado!");
    }

    await prisma.historyVideo.deleteMany({
      where: { user: { externalId: user.id } },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      let message = "Houve um erro ao deletar o histórico!";
      if (error.code === "P2025") {
        message = "Usuário não encontrado!";
      }
      return objectError(message);
    }

    if (error instanceof Error) {
      return objectError(error.message);
    }

    return objectError("Houve um erro ao deletar o histórico!");
  }

  return {
    success: true,
    message: "Histórico deletado com sucesso!",
    errors: null,
    data: null,
  };
}
