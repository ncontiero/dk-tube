import type { NextApiRequest } from "next";

import { z } from "zod";
import { transformData } from "./transformData";

const querySchema = z.object({
  limit: z.string().transform(Number).optional(),
  filter: z.string().transform(transformData).optional(),
  orderBy: z.string().transform(transformData).optional(),
});

export function queryParser(req: NextApiRequest) {
  return querySchema.parse(req.query);
}
