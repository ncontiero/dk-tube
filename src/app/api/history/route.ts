import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const handlePlaylistSchema = z.object({
  videoId: z.string(),
  playedSeconds: z.number(),
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { videoId, playedSeconds } = handlePlaylistSchema.parse(
      await request.json(),
    );

    const history = await prisma.historyVideo.findFirst({
      where: {
        user: { externalId: userId },
        videoId,
      },
    });

    if (history) {
      await prisma.historyVideo.update({
        where: { id: history.id },
        data: { videoTime: playedSeconds },
      });
    } else {
      await prisma.historyVideo.create({
        data: {
          videoTime: playedSeconds,
          video: { connect: { id: videoId } },
          user: { connect: { externalId: userId } },
        },
      });
    }

    return new Response("OK");
  } catch (error) {
    console.error(error);

    const unauthorized =
      error instanceof Error && error.message.includes("Unauthorized");
    const status = unauthorized ? 401 : 500;

    if (error instanceof Error) {
      return new Response(error.message, { status });
    }
    return new Response("Internal Server Error", { status });
  }
}
