import { Prisma, PrismaClient } from "@prisma/client";
import { env } from "@/env";

const createPrismaClient = () => new PrismaClient();

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
export const prismaSkip = Prisma.skip;

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
