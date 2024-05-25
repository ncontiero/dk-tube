import type { NextApiRequest, NextApiResponse } from "next";

import { createRouter } from "next-connect";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { playlistFormatter } from "@/utils/formatters";
import { catchError } from "@/utils/errors";

const router = createRouter<NextApiRequest, NextApiResponse>();

const paramsSchema = z.object({
  id: z.string().cuid(),
});

router.get(async (req, res) => {
  try {
    const { id } = paramsSchema.parse(req.query);

    const playlist = await prisma.playlist.findUnique({
      where: { id },
      include: { user: true, videos: { include: { user: true } } },
    });
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found", status: 404 });
    }

    return res.status(200).json(playlistFormatter(playlist));
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
