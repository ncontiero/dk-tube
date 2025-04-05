import { z } from "zod";

export const searchVideoOnHistorySchema = z.object({
  search: z.string().default(""),
});
export type SearchVideoOnHistorySchema = z.infer<
  typeof searchVideoOnHistorySchema
>;

export const getTimeWatchedSchema = z.object({
  videoId: z.string().cuid(),
  userId: z.string(),
});

export const removeVideoFromHistorySchema = z.object({
  videoId: z.string().cuid(),
});

export const updateHistorySchema = z.object({
  videoId: z.string().cuid(),
  playedSeconds: z.number(),
});
