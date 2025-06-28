import { PrismaClient } from "@prisma/client";

// Declare prismaInstance outside the function to maintain its state
let prismaInstance: PrismaClient;

export default function getPrismaInstance(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
}
