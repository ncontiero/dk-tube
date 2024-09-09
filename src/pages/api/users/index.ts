import type { NextApiRequest, NextApiResponse } from "next";

import { createRouter } from "next-connect";
import { prisma } from "@/lib/prisma";
import { userWithVideosFormatter } from "@/utils/formatters";
import { queryParser } from "@/utils/parser";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  try {
    const { limit, filter, orderBy } = queryParser(req);
    const orderColumn = orderBy?.column || "createdAt";
    const filterColumn = filter?.column || "username";

    const users = await prisma.user.findMany({
      orderBy: { [orderColumn]: orderBy?.value || "asc" },
      include: {
        playlists: { include: { videos: { include: { user: true } } } },
        videos: true,
      },
      where: {
        [filterColumn]: {
          contains: filter?.value,
          mode: "insensitive",
        },
      },
      take: limit,
    });

    res.status(200).json(users.map((u) => userWithVideosFormatter(u)));
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      fullError: error,
      status: 500,
    });
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
