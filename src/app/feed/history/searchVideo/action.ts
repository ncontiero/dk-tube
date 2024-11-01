"use server";

import type { ActionsReturn } from "@/hooks/useFormState";
import { z } from "zod";

const searchVideoSchema = z.object({
  search: z.string().default(""),
});
export type SearchVideoDataKeys = keyof z.infer<typeof searchVideoSchema>;

export const searchAction = async (
  data: FormData,
  // eslint-disable-next-line require-await
): ActionsReturn<SearchVideoDataKeys> => {
  const result = searchVideoSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors, data: null };
  }

  return {
    success: true,
    message: "Pesquisa realizada com sucesso",
    errors: null,
    data: result.data,
  };
};
