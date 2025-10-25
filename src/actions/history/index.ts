"use server";

import { unstable_cache, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { actionClient, authActionClient } from "@/lib/safe-action";
import {
  getTimeWatchedSchema,
  removeVideoFromHistorySchema,
  searchVideoOnHistorySchema,
  updateHistorySchema,
} from "./schema";

export const deleteHistoryAction = authActionClient.action(
  async ({ ctx: { user } }) => {
    const history = await prisma.historyVideo.findMany({
      where: { user: { externalId: user.id } },
    });

    if (!history) {
      throw new Error("Histórico não encontrado!");
    }

    try {
      await prisma.historyVideo.deleteMany({
        where: { user: { externalId: user.id } },
      });
    } catch {
      throw new Error("Houve um erro ao deletar o histórico!");
    }

    updateTag(`history:${user.id}`);
    updateTag(`feed:${user.id}`);
  },
);

export const searchVideoOnHistoryAction = actionClient
  .schema(searchVideoOnHistorySchema)
  // eslint-disable-next-line require-await
  .action(async ({ clientInput: { search } }) => {
    redirect(`/feed/history?query=${search}`);
  });

export const getTimeWatchedAction = actionClient
  .schema(getTimeWatchedSchema)
  .action(async ({ clientInput: { videoId, userId } }) => {
    const cachedHistory = unstable_cache(
      async () => {
        const history = await prisma.historyVideo.findFirst({
          where: {
            user: { externalId: userId },
            videoId,
          },
        });

        if (!history) {
          return 0;
        }

        return history.videoTime;
      },
      [`history:${userId}:${videoId}`],
      { tags: [`history:${userId}`], revalidate: 60 },
    );

    return await cachedHistory();
  });

export const removeVideoFromHistoryAction = authActionClient
  .schema(removeVideoFromHistorySchema)
  .action(async ({ clientInput: { videoId }, ctx: { user } }) => {
    const history = await prisma.historyVideo.findMany({
      where: { user: { externalId: user.id }, videoId },
      include: { video: true },
    });

    if (history.length === 0) {
      throw new Error("Vídeo não encontrado no histórico");
    }

    await prisma.historyVideo.deleteMany({
      where: { user: { externalId: user.id }, videoId },
    });

    updateTag(`history:${user.id}`);
    updateTag(`feed:${user.id}`);
  });

export const updateHistoryAction = authActionClient
  .schema(updateHistorySchema)
  .action(
    async ({ clientInput: { videoId, playedSeconds }, ctx: { user } }) => {
      const history = await prisma.historyVideo.findFirst({
        where: { user: { externalId: user.id }, videoId },
      });

      if (!history) {
        await prisma.historyVideo.create({
          data: {
            videoTime: playedSeconds,
            video: { connect: { id: videoId } },
            user: { connect: { externalId: user.id } },
          },
        });

        updateTag(`history:${user.id}`);
        updateTag(`feed:${user.id}`);

        return;
      }

      await prisma.historyVideo.update({
        where: { id: history.id },
        data: { videoTime: playedSeconds },
      });

      updateTag(`history:${user.id}`);
      updateTag(`feed:${user.id}`);
    },
  );
