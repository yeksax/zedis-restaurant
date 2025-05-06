import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
    errorFormat: "minimal",
    transactionOptions: {
      timeout: 25000,
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
