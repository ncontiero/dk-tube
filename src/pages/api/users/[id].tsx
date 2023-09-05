import type { NextApiRequest, NextApiResponse } from "next";

import { createRouter } from "next-connect";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { userWithVideosFormatter } from "@/utils/formatters";
import { catchError } from "@/utils/errors";

const router = createRouter<NextApiRequest, NextApiResponse>();

const paramsSchema = z.object({
  id: z.string().uuid(),
});

router.get(async (req, res) => {
  try {
    const { id } = paramsSchema.parse(req.query);

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        playlists: { include: { videos: { include: { user: true } } } },
        videos: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found", status: 404 });
    }

    return res.status(200).json(userWithVideosFormatter(user));
  } catch (err: unknown) {
    const response = catchError(err);
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
