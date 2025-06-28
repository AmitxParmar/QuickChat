import pkg from "@prisma/client";
const { PrismaClient } = pkg;
let prismaInstance;

export default function getPrismaInstance() {
  if (!prismaInstance) prismaInstance = new PrismaClient();
  return prismaInstance;
}
