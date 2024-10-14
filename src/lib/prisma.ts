import { Prisma, PrismaClient } from "@prisma/client";
import { env } from "@/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    omit: {
      user: { externalId: true, email: true },
      video: { userId: true },
      playlist: { userId: true },
    },
  });
export const prismaSkip = Prisma.skip;

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
