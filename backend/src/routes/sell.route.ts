import { Router } from "express";
import {
  confirmSell,
  createSell,
  dashboardSell,
  historySell,
  infoSell,
  listSell,
  removeSell,
} from "../controllers/SellController";
import { authenticate, authorize } from "../middleware/auth.middleware";
const router = Router();

/**
 * @swagger
 * /sell/list:
 *   get:
 *     tags:
 *       - Sales
 *     summary: แสดงรายการขายทั้งหมด
 *     description: ดึงข้อมูลรายการขายทั้งหมดในระบบ
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: แสดงรายการขายสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardResponse'
 *       401:
 *         description: ไม่ได้ยืนยันตัวตนหรือ Token ไม่ถูกต้อง
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /sell/create:
 *   post:
 *     tags:
 *       - Sales
 *     summary: สร้างรายการขาย
 *     description: สร้างรายการขายสินค้าใหม่ (Admin และ User)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serial
 *               - price
 *             properties:
 *               serial:
 *                 type: string
 *                 example: SN123456789
 *                 description: Serial number ของสินค้า (ต้องมีในสต็อก)
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 42000
 *                 description: ราคาขาย
 *               customerName:
 *                 type: string
 *                 example: สมชาย ใจดี
 *                 description: ชื่อลูกค้า (ถ้ามี)
 *               customerPhone:
 *                 type: string
 *                 example: 081-234-5678
 *                 description: เบอร์โทรลูกค้า (ถ้ามี)
 *     responses:
 *       201:
 *         description: สร้างรายการขายสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardResponse'
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง หรือไม่พบ Serial ในสต็อก
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: ไม่ได้ยืนยันตัวตนหรือ Token ไม่ถูกต้อง
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: ไม่มีสิทธิ์เข้าถึง
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /sell/remove/{id}:
 *   delete:
 *     tags:
 *       - Sales
 *     summary: ลบรายการขาย
 *     description: ลบรายการขายออกจากระบบตาม ID (เฉพาะ Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sell ID
 *         example: 1
 *     responses:
 *       200:
 *         description: ลบรายการขายสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardResponse'
 *       401:
 *         description: ไม่ได้ยืนยันตัวตนหรือ Token ไม่ถูกต้อง
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: ไม่มีสิทธิ์เข้าถึง (ต้องเป็น Admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: ไม่พบรายการขาย
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /sell/confirm:
 *   get:
 *     tags:
 *       - Sales
 *     summary: ยืนยันรายการขายที่รอดำเนินการ
 *     description: ยืนยันรายการขายทั้งหมดที่ยังไม่ได้ยืนยัน (เฉพาะ Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ยืนยันรายการสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardResponse'
 *       401:
 *         description: ไม่ได้ยืนยันตัวตนหรือ Token ไม่ถูกต้อง
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: ไม่มีสิทธิ์เข้าถึง (ต้องเป็น Admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /sell/dashboard/{year}:
 *   get:
 *     tags:
 *       - Sales
 *     summary: Dashboard ข้อมูลการขายรายปี
 *     description: ดึงข้อมูลสรุปการขายแยกตามเดือนในปีที่กำหนด
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: ปี พ.ศ.
 *         example: 2568
 *     responses:
 *       200:
 *         description: ดึงข้อมูล Dashboard สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardResponse'
 *       401:
 *         description: ไม่ได้ยืนยันตัวตนหรือ Token ไม่ถูกต้อง
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /sell/history:
 *   get:
 *     tags:
 *       - Sales
 *     summary: ประวัติการขายทั้งหมด
 *     description: ดึงประวัติการขายทั้งหมดที่ผ่านมา
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงข้อมูลประวัติสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardResponse'
 *       401:
 *         description: ไม่ได้ยืนยันตัวตนหรือ Token ไม่ถูกต้อง
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /sell/info/{id}:
 *   get:
 *     tags:
 *       - Sales
 *     summary: ดูรายละเอียดการขาย
 *     description: ดึงข้อมูลรายละเอียดการขายตาม ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sell ID
 *         example: 1
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardResponse'
 *       401:
 *         description: ไม่ได้ยืนยันตัวตนหรือ Token ไม่ถูกต้อง
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: ไม่พบรายการขาย
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get("/sell/list", authenticate, listSell);
router.post("/sell/create", authenticate, authorize(["admin", "user"]), createSell);
router.delete("/sell/remove/:id", authenticate, authorize(["admin"]), removeSell);
router.get("/sell/confirm", authenticate, authorize(["admin"]), confirmSell);
router.get("/sell/dashboard/:year", authenticate, dashboardSell);
router.get("/sell/history", authenticate, historySell);
router.get("/sell/info/:id", authenticate, infoSell);

export default router;
