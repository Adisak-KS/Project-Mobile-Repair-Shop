import { Router } from "express";
import { createCompany, listCompany } from "../controllers/CompanyController";
import { authenticate, authorize } from "../middleware/auth.middleware";
const router = Router();

/**
 * @swagger
 * /company/create:
 *   post:
 *     tags:
 *       - Company
 *     summary: สร้างข้อมูลบริษัท
 *     description: สร้างหรืออัปเดตข้อมูลบริษัท (เฉพาะ Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - phone
 *               - taxId
 *             properties:
 *               name:
 *                 type: string
 *                 example: บริษัท ซ่อมมือถือ จำกัด
 *                 description: ชื่อบริษัท
 *               address:
 *                 type: string
 *                 example: 123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110
 *                 description: ที่อยู่บริษัท
 *               phone:
 *                 type: string
 *                 example: 02-123-4567
 *                 description: เบอร์โทรศัพท์
 *               taxId:
 *                 type: string
 *                 example: 0105558888888
 *                 description: เลขประจำตัวผู้เสียภาษี
 *               email:
 *                 type: string
 *                 format: email
 *                 example: info@mobilerepair.com
 *                 description: อีเมล (ถ้ามี)
 *               website:
 *                 type: string
 *                 format: uri
 *                 example: https://www.mobilerepair.com
 *                 description: เว็บไซต์ (ถ้ามี)
 *     responses:
 *       200:
 *         description: สร้างหรืออัปเดตข้อมูลบริษัทสำเร็จ
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
 * /company/list:
 *   get:
 *     tags:
 *       - Company
 *     summary: แสดงข้อมูลบริษัท
 *     description: ดึงข้อมูลบริษัทที่บันทึกไว้
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: แสดงข้อมูลบริษัทสำเร็จ
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

router.post("/company/create", authenticate, authorize(["admin"]), createCompany);
router.get("/company/list", authenticate, listCompany);

export default router;
