"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// ป้องกันการสร้าง PrismaClient หลาย instance ระหว่าง Hot Reload (dev mode)
const globalForPrisma = global;
exports.prisma = globalForPrisma.prisma ||
    new client_1.PrismaClient({
        log: ["query", "info", "warn", "error"], // เปิด log ตอน dev
    });
// เก็บ instance ใน global (เฉพาะ dev) เพื่อป้องกัน reconnect ทุกครั้งที่ reload
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.prisma;
