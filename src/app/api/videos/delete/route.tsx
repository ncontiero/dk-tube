import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const removeVideoSchema = z.object({
  videoId: z.string(),
});

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { videoId } = removeVideoSchema.parse(await request.json());

    const video = await prisma.video.findFirst({
      where: { id: videoId, user: { externalId: userId } },
    });
    if (!video) {
      return new Response("Video not found", { status: 404 });
    }

    await prisma.video.delete({
      where: { id: videoId },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(JSON.stringify(error));

    const unauthorized =
      error instanceof Error && error.message.includes("Unauthorized");
    const status = unauthorized ? 401 : 500;

    if (error instanceof Error) {
      return new Response(error.message, { status });
    }
    return new Response("Internal Server Error", { status });
  }
}
