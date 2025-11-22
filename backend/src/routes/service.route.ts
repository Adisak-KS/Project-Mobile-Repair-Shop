import { Router } from "express";
import { createService, listService, removeService, updateService } from "../controllers/ServiceController";
import { authenticate, authorize } from "../middleware/auth.middleware";
const router = Router();

/**
 * @swagger
 * /service/list:
 *   get:
 *     tags:
 *       - Services
 *     summary: แสดงรายการบริการซ่อมทั้งหมด
 *     description: ดึงข้อมูลรายการบริการซ่อมทั้งหมดในระบบ
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: แสดงรายการบริการสำเร็จ
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
 * /service/create:
 *   post:
 *     tags:
 *       - Services
 *     summary: สร้างรายการบริการซ่อม
 *     description: สร้างรายการบริการซ่อมใหม่ (เฉพาะ Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - customerPhone
 *               - deviceType
 *               - problem
 *               - status
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: สมชาย ใจดี
 *                 description: ชื่อลูกค้า
 *               customerPhone:
 *                 type: string
 *                 example: 081-234-5678
 *                 description: เบอร์โทรลูกค้า
 *               deviceType:
 *                 type: string
 *                 example: iPhone 15 Pro Max
 *                 description: รุ่นเครื่อง
 *               problem:
 *                 type: string
 *                 example: หน้าจอแตก
 *                 description: อาการเสีย
 *               status:
 *                 type: string
 *                 enum: [รอดำเนินการ, กำลังซ่อม, ซ่อมเสร็จแล้ว, ส่งมอบแล้ว]
 *                 example: รอดำเนินการ
 *                 description: สถานะการซ่อม
 *               estimatedCost:
 *                 type: number
 *                 format: float
 *                 example: 3500
 *                 description: ค่าซ่อมประมาณ (ถ้ามี)
 *               note:
 *                 type: string
 *                 example: รอคอนเฟิร์มกับลูกค้า
 *                 description: หมายเหตุ (ถ้ามี)
 *     responses:
 *       201:
 *         description: สร้างรายการบริการสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardResponse'
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
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
 * /service/update/{id}:
 *   put:
 *     tags:
 *       - Services
 *     summary: แก้ไขรายการบริการซ่อม
 *     description: แก้ไขข้อมูลรายการบริการซ่อมตาม ID (เฉพาะ Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Service ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: สมชาย ใจดี
 *                 description: ชื่อลูกค้า
 *               customerPhone:
 *                 type: string
 *                 example: 081-234-5678
 *                 description: เบอร์โทรลูกค้า
 *               deviceType:
 *                 type: string
 *                 example: iPhone 15 Pro Max
 *                 description: รุ่นเครื่อง
 *               problem:
 *                 type: string
 *                 example: หน้าจอแตก และ แบตเสื่อม
 *                 description: อาการเสีย
 *               status:
 *                 type: string
 *                 enum: [รอดำเนินการ, กำลังซ่อม, ซ่อมเสร็จแล้ว, ส่งมอบแล้ว]
 *                 example: กำลังซ่อม
 *                 description: สถานะการซ่อม
 *               estimatedCost:
 *                 type: number
 *                 format: float
 *                 example: 4500
 *                 description: ค่าซ่อมประมาณ
 *               note:
 *                 type: string
 *                 example: เปลี่ยนหน้าจอและแบตเตอรี่แล้ว
 *                 description: หมายเหตุ
 *     responses:
 *       200:
 *         description: แก้ไขข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardResponse'
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
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
 *         description: ไม่มีสิทธิ์เข้าถึง (ต้องเป็น Admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: ไม่พบรายการบริการ
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
 * /service/remove/{id}:
 *   delete:
 *     tags:
 *       - Services
 *     summary: ลบรายการบริการซ่อม
 *     description: ลบรายการบริการซ่อมออกจากระบบตาม ID (เฉพาะ Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Service ID
 *         example: 1
 *     responses:
 *       200:
 *         description: ลบรายการบริการสำเร็จ
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
 *         description: ไม่พบรายการบริการ
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

router.get("/service/list", authenticate, listService);
router.post("/service/create", authenticate, authorize(["admin"]), createService);
router.put("/service/update/:id", authenticate, authorize(["admin"]), updateService);
router.delete("/service/remove/:id", authenticate, authorize(["admin"]), removeService);

export default router;
