"use server";

import type { ActionsReturn } from "@/hooks/useFormState";
import { z } from "zod";

const searchSchema = z.object({
  search: z.string().min(1, "A pesquisa não pode estar vazia."),
});
export type SearchDataKeys = keyof z.infer<typeof searchSchema>;

export const searchAction = async (
  data: FormData,
  // eslint-disable-next-line require-await
): ActionsReturn<SearchDataKeys> => {
  const result = searchSchema.safeParse(Object.fromEntries(data));

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
