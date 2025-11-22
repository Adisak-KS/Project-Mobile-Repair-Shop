import { Router } from "express";
const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - Health Check
 *     summary: ตรวจสอบสถานะ API Server
 *     description: ใช้สำหรับตรวจสอบว่า API Server ทำงานอยู่หรือไม่
 *     responses:
 *       200:
 *         description: API Server ทำงานปกติ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: API Server is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-15T10:30:00.000Z
 *                 uptime:
 *                   type: number
 *                   example: 12345.67
 *                   description: Server uptime in seconds
 */
router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;