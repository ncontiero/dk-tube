import { z } from "zod";

export const createPlaylistSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  videoId: z.string().optional(),
  isPublic: z.boolean().default(false),
});
export type CreatePlaylistSchema = z.infer<typeof createPlaylistSchema>;

export const updatePlaylistSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  isPublic: z.boolean().default(false),
});
export type UpdatePlaylistSchema = z.infer<typeof updatePlaylistSchema>;

export const deletePlaylistSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
});

export const handleVideoFromPlaylistSchema = z.object({
  videoId: z.cuid(),
  playlistId: z.string(),
});
