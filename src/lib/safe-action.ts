import { currentUser } from "@clerk/nextjs/server";
import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if (error instanceof Error) {
      return error.message;
    }

    return "Algo deu errado durante a execução da operação. Tente novamente mais tarde.";
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to perform this action");
  }

  return next({ ctx: { user } });
});
