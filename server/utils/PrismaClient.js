/* import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");
 */
import { PrismaClient } from "@prisma/client";
let prismaInstance;

export default function getPrismaInstance() {
  if (!prismaInstance) prismaInstance = new PrismaClient();
  return prismaInstance;
}
