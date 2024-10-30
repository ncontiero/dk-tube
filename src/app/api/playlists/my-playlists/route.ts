import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getWatchLater } from "@/utils/data";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const videoSelected = searchParams.get("videoId");

    const watchLater = await getWatchLater(userId);
    if (!watchLater) throw new Error("Watch later not found");

    const playlists = await prisma.playlist.findMany({
      where: {
        user: { externalId: userId },
      },
      include: { videos: { select: { id: true } } },
    });

    const playlistsResponse = [...playlists, watchLater].map((pl) => {
      const hasVideo = pl.videos.some((v) => v.id === videoSelected);
      return { ...pl, hasVideo };
    });

    return new Response(JSON.stringify(playlistsResponse), { status: 200 });
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

const updatePlaylistSchema = z.object({
  videoId: z.string(),
  playlistId: z.string(),
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { videoId, playlistId } = updatePlaylistSchema.parse(
      await request.json(),
    );

    const playlist =
      playlistId === "watch-later"
        ? await getWatchLater(userId)
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
    const connected = playlist.videos.some((v) => v.id === videoId);

    if (playlistId === "watch-later") {
      const updatedWatchLater = await prisma.user.update({
        where: { externalId: userId },
        data: {
          watchLater: {
            [connected ? "disconnect" : "connect"]: {
              id: videoId,
            },
          },
        },
        include: { watchLater: true },
      });

      return new Response(JSON.stringify(updatedWatchLater), { status: 200 });
    }
    const updatedPlaylist = await prisma.playlist.update({
      where: { id: playlistId },
      data: {
        videos: {
          [connected ? "disconnect" : "connect"]: {
            id: videoId,
          },
        },
      },
      include: { videos: true },
    });

    return new Response(JSON.stringify(updatedPlaylist), { status: 200 });
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
