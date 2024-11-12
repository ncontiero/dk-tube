import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const removeVideoFromHistorySchema = z.object({
  videoId: z.string(),
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { videoId } = removeVideoFromHistorySchema.parse(
      await request.json(),
    );

    const history = await prisma.historyVideo.findMany({
      where: { user: { externalId: userId }, videoId },
      include: { video: true },
    });

    if (history.length === 0) {
      return new Response("Video not found in history", { status: 404 });
    }

    await prisma.historyVideo.deleteMany({
      where: { user: { externalId: userId }, videoId },
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
