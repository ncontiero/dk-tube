import type { NextApiRequest, NextApiResponse } from "next";

import { createRouter } from "next-connect";
import { prisma } from "@/lib/prisma";
import {
  searchedVideoFormatter,
  searchedUserFormatter,
} from "@/utils/formatters";
import { z } from "zod";
import { catchError } from "@/utils/errors";

const router = createRouter<NextApiRequest, NextApiResponse>();

const queryParserSchema = z.object({
  limit: z.string().transform(Number).optional(),
  search: z.string().nonempty("The search query is required"),
});

router.get(async (req, res) => {
  try {
    const { search, limit } = queryParserSchema.parse(req.query);

    const videos = await prisma.video.findMany({
      include: { user: true },
      where: { title: { contains: search, mode: "insensitive" } },
    });
    const videosFormatted = videos.map(searchedVideoFormatter);

    const users = await prisma.user.findMany({
      where: { username: { contains: search, mode: "insensitive" } },
    });
    const usersFormatted = users.map(searchedUserFormatter);

    const searchItems = [...videosFormatted, ...usersFormatted];

    let maxLettersAppear = 0;
    const searchReturn = [];
    for (const item of searchItems) {
      let lettersQuantity = 0;
      for (const letter of item.label.toLowerCase()) {
        for (const searchLetter of search.toLowerCase()) {
          if (letter === searchLetter) {
            lettersQuantity++;
          }
        }
      }
      if (lettersQuantity >= maxLettersAppear) {
        maxLettersAppear = lettersQuantity;
        searchReturn.unshift(item);
      } else {
        searchReturn.push(item);
      }
    }

    res.status(200).json(searchReturn.slice(0, limit || searchReturn.length));
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
