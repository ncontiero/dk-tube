import type { NextApiRequest, NextApiResponse } from "next";

import { createRouter } from "next-connect";
import { queryParser } from "@/utils/queryParser";
import { prisma } from "@/lib/prisma";
import { videoFormatter } from "@/utils/formatters";
import { z } from "zod";
import { catchError } from "@/utils/errors";
import { getMostQualityThumb } from "@/utils/getMostQualityThumb";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  try {
    const { limit, filter, orderBy } = queryParser(req);
    const orderColumn = orderBy?.column || "createdAt";
    const filterColumn = filter?.column || "title";

    const videos = await prisma.video.findMany({
      orderBy: { [orderColumn]: orderBy?.value || "asc" },
      include: { user: true },
      where: {
        [filterColumn]: {
          contains: filter?.value,
          mode: "insensitive",
        },
      },
      take: limit,
    });

    res.status(200).json(videos.map(videoFormatter));
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      fullError: error,
      status: 500,
    });
  }
});

const createVideoSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  youtubeId: z.string().min(1, { message: "youtubeId is required" }),
  userId: z.string().uuid(),
});

router.post(async (req, res) => {
  try {
    const { title, youtubeId, userId } = createVideoSchema.parse(req.body);
    const thumb = (await getMostQualityThumb(youtubeId)) as string;

    const video = await prisma.video.create({
      data: {
        title,
        youtubeId,
        thumb,
        userId,
      },
      include: { user: true },
    });

    res.status(201).json(videoFormatter(video));
  } catch (err) {
    const response = catchError(err);
    res.status(response.status).json(response);
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
