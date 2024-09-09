import type { NextApiRequest, NextApiResponse } from "next";

import { createRouter } from "next-connect";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { catchError } from "@/utils/errors";
import { videoFormatter } from "@/utils/formatters";

const router = createRouter<NextApiRequest, NextApiResponse>();

const paramsSchema = z.object({
  id: z.string().cuid(),
});

router.get(async (req, res) => {
  try {
    const { id } = paramsSchema.parse(req.query);

    const video = await prisma.video.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!video) {
      return res.status(404).json({ error: "Video not found", status: 404 });
    }

    return res.status(200).json(videoFormatter(video));
  } catch (error: unknown) {
    const response = catchError(error);
    return res.status(response.status).json(response);
  }
});

router.all((req, res) => {
  res.status(405).json({ error: "Method not allowed", status: 405 });
});

export default router.handler({
  onError(err, req, res) {
    res.status(400).json({
      error: (err as Error).message,
      status: 400,
    });
  },
});
