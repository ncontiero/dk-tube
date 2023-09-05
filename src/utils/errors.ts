import { z } from "zod";

export function catchError(error: unknown) {
  let message = "Internal server error";
  let status = 500;

  if (error instanceof z.ZodError) {
    if (error.issues[0].message === "Invalid uuid") {
      message = "Invalid uuid";
    }
    message = "Invalid parameters";
    status = 400;
  }

  return {
    error: message,
    fullError: error,
    status,
  };
}
