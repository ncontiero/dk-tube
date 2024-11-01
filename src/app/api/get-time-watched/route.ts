import { z } from "zod";
import { prisma } from "@/lib/prisma";

const searchParamsSchema = z.object({
  videoId: z.string(),
  userId: z.string(),
});

export async function GET(request: Request) {
  try {
    const { videoId, userId } = searchParamsSchema.parse(
      Object.fromEntries(new URL(request.url).searchParams.entries()),
    );
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const history = await prisma.historyVideo.findFirst({
      where: {
        user: { externalId: userId },
        videoId,
      },
    });
    if (!history) {
      return new Response(JSON.stringify({ error: "History not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ timeWatched: history.videoTime }));
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
