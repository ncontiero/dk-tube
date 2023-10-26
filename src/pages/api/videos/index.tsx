import type { NextApiRequest, NextApiResponse } from "next";

import { createRouter } from "next-connect";
import { queryParser } from "@/utils/queryParser";
import { prisma } from "@/lib/prisma";
import { videoFormatter } from "@/utils/formatters";
import { z } from "zod";
import { catchError } from "@/utils/errors";
import { getMostQualityThumb } from "@/utils/getMostQualityThumb";
import { getAuth } from "@clerk/nextjs/server";

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
  title: z.string().min(1, "Title is required"),
  youtubeId: z.string().min(1, "YoutubeId is required"),
});

router.post(async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized", status: 401 });
    }

    const { title, youtubeId } = createVideoSchema.parse(req.body);
    const thumb = (await getMostQualityThumb(youtubeId)) as string;

    const video = await prisma.video.create({
      data: {
        title,
        youtubeId,
        thumb,
        user: { connect: { externalId: userId } },
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
