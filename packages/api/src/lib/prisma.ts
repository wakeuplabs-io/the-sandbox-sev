import { PrismaClient } from "@/generated/prisma";

// Create a single Prisma instance
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

// Test connection on startup
prisma
  .$connect()
  .then(() => console.log("✅ Database connected successfully"))
  .catch(error => console.error("❌ Database connection failed:", error));

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

// Handle process termination
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;