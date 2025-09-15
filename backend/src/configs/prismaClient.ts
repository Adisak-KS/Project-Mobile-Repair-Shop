import { Prisma, PrismaClient } from "@prisma/client";

// ป้องกันการสร้าง PrismaClient หลาย instance ระหว่าง Hot Reload (dev mode)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // เปิด log ตอน dev
  });

// เก็บ instance ใน global (เฉพาะ dev) เพื่อป้องกัน reconnect ทุกครั้งที่ reload
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
