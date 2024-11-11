import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const handleLikeVideoSchema = z.object({
  videoId: z.string(),
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { videoId } = handleLikeVideoSchema.parse(await request.json());

    const user = await prisma.user.findFirst({
      where: { externalId: userId },
      select: { id: true, likedVideos: { select: { id: true } } },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    const connected = user.likedVideos.some((v) => v.id === videoId);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        likedVideos: {
          [connected ? "disconnect" : "connect"]: {
            id: videoId,
          },
        },
      },
      include: { likedVideos: true },
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
