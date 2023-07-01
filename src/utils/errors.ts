import { z } from "zod";

export function catchError(error: any) {
  let message = "Internal server error";
  if (error instanceof z.ZodError) {
    if (error.issues[0].message === "Invalid uuid") {
      message = "Invalid uuid";
    }
    message = "Invalid parameters";
  }

  return {
    error: message,
    fullError: error,
    status: 500,
  };
}
