import { z } from "zod";

export const createVideoSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  youtubeId: z.string().min(1, "O id do vídeo do Youtube é obrigatório"),
});
export type CreateVideoSchema = z.infer<typeof createVideoSchema>;

export const likeVideoSchema = z.object({
  videoId: z.string().min(1, "O id do vídeo é obrigatório"),
});

export const removeVideoSchema = z.object({
  videoId: z.string().min(1, "O id do vídeo é obrigatório"),
});
