import { Router } from "express";
import { signIn, signUp } from "../controllers/AuthController";
const router = Router();

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: เข้าสู่ระบบ
 *     description: ใช้สำหรับเข้าสู่ระบบด้วย username และ password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *                 description: ชื่อผู้ใช้งาน
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *                 description: รหัสผ่าน
 *     responses:
 *       200:
 *         description: เข้าสู่ระบบสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardResponse'
 *       401:
 *         description: ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
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
 * /auth/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: สมัครสมาชิก
 *     description: ใช้สำหรับสร้างบัญชีผู้ใช้งานใหม่
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               username:
 *                 type: string
 *                 example: newuser
 *                 description: ชื่อผู้ใช้งาน
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *                 description: รหัสผ่าน
 *               firstName:
 *                 type: string
 *                 example: สมชาย
 *                 description: ชื่อจริง
 *               lastName:
 *                 type: string
 *                 example: ใจดี
 *                 description: นามสกุล
 *     responses:
 *       201:
 *         description: สมัครสมาชิกสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardResponse'
 *       400:
 *         description: ข้อมูลไม่ถูกต้องหรือ username ซ้ำ
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

router.post("/auth/signin", signIn);
router.post("/auth/signup", signUp);

export default router;