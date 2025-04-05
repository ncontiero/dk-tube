import { z } from "zod";

export const searchVideosSchema = z.object({
  search: z.string().min(1, "Pergunta não pode ser vazia"),
});
export type SearchVideosSchema = z.infer<typeof searchVideosSchema>;
