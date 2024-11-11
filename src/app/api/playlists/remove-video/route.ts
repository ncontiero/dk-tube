import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getLikedVideos } from "@/utils/data";

const removeVideoFromPlaylistSchema = z.object({
  videoId: z.string(),
  playlistId: z.string(),
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { videoId, playlistId } = removeVideoFromPlaylistSchema.parse(
      await request.json(),
    );

    const playlist =
      playlistId === "LL"
        ? await getLikedVideos(userId)
        : await prisma.playlist.findUnique({
            where: { id: playlistId },
            include: { videos: true, user: { omit: { externalId: false } } },
          });

    if (!playlist) {
      return new Response("Playlist not found", { status: 404 });
    }

    if (playlist.user.externalId !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (playlist.videos?.find((video) => video.id === videoId) === undefined) {
      return new Response("Video not found in playlist", { status: 404 });
    }

    if (playlistId === "LL") {
      await prisma.user.update({
        where: { externalId: userId },
        data: {
          likedVideos: {
            disconnect: {
              id: videoId,
            },
          },
        },
      });

      return new Response(null, { status: 200 });
    }

    await prisma.playlist.update({
      where: { id: playlistId },
      data: {
        videos: {
          disconnect: {
            id: videoId,
          },
        },
      },
      include: { videos: true },
    });

    return new Response(null, { status: 200 });
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
