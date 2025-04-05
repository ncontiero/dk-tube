"use server";

import { redirect } from "next/navigation";
import { searchVideosSchema } from "@/actions/schema";
import { actionClient } from "@/lib/safe-action";

export const searchVideosAction = actionClient
  .schema(searchVideosSchema)
  // eslint-disable-next-line require-await
  .action(async ({ clientInput: { search } }) => {
    redirect(`/search?q=${search}`);
  });
