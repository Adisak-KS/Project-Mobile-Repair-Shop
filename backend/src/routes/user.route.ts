import { Router } from "express";
import {
  createUser,
  infoUser,
  listUser,
  removeUser,
  updateUser,
  updateUserInfo,
} from "../controllers/UserController";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /user/list:
 *   get:
 *     tags:
 *       - Users
 *     summary: แสดงรายการผู้ใช้งานทั้งหมด
 *     description: ดึงข้อมูลผู้ใช้งานทั้งหมดในระบบ (เฉพาะ Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: แสดงรายการผู้ใช้งานสำเร็จ
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
 * /user/create:
 *   post:
 *     tags:
 *       - Users
 *     summary: สร้างผู้ใช้งานใหม่
 *     description: สร้างบัญชีผู้ใช้งานใหม่ในระบบ (เฉพาะ Admin)
 *     security:
 *       - bearerAuth: []
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
 *               - level
 *             properties:
 *               username:
 *                 type: string
 *                 example: user001
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
 *               level:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: user
 *                 description: ระดับผู้ใช้งาน
 *     responses:
 *       201:
 *         description: สร้างผู้ใช้งานสำเร็จ
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
 * /user/update/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: แก้ไขข้อมูลผู้ใช้งาน
 *     description: แก้ไขข้อมูลผู้ใช้งานตาม ID (เฉพาะ Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: user001
 *                 description: ชื่อผู้ใช้งาน
 *               password:
 *                 type: string
 *                 format: password
 *                 example: newpassword123
 *                 description: รหัสผ่านใหม่ (ถ้าต้องการเปลี่ยน)
 *               firstName:
 *                 type: string
 *                 example: สมชาย
 *                 description: ชื่อจริง
 *               lastName:
 *                 type: string
 *                 example: ใจดี
 *                 description: นามสกุล
 *               level:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: user
 *                 description: ระดับผู้ใช้งาน
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
 *         description: ไม่พบผู้ใช้งาน
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
 * /user/remove/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: ลบผู้ใช้งาน
 *     description: ลบผู้ใช้งานออกจากระบบตาม ID (เฉพาะ Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *         example: 1
 *     responses:
 *       200:
 *         description: ลบผู้ใช้งานสำเร็จ
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
 *         description: ไม่พบผู้ใช้งาน
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
 * /user/info:
 *   get:
 *     tags:
 *       - Users
 *     summary: ดูข้อมูลผู้ใช้งานตัวเอง
 *     description: ดึงข้อมูลของผู้ใช้งานที่เข้าสู่ระบบอยู่
 *     security:
 *       - bearerAuth: []
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
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /user/update:
 *   put:
 *     tags:
 *       - Users
 *     summary: แก้ไขข้อมูลผู้ใช้งานตัวเอง
 *     description: แก้ไขข้อมูลของผู้ใช้งานที่เข้าสู่ระบบอยู่
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: newpassword123
 *                 description: รหัสผ่านใหม่ (ถ้าต้องการเปลี่ยน)
 *               firstName:
 *                 type: string
 *                 example: สมชาย
 *                 description: ชื่อจริง
 *               lastName:
 *                 type: string
 *                 example: ใจดี
 *                 description: นามสกุล
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
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get("/user/list", authenticate, authorize(["admin"]), listUser);
router.post("/user/create", authenticate, authorize(["admin"]), createUser);
router.put("/user/update/:id", authenticate, authorize(["admin"]), updateUser);
router.delete("/user/remove/:id", authenticate, authorize(["admin"]), removeUser);
router.get("/user/info", authenticate, infoUser);
router.put("/user/update", authenticate, updateUserInfo);

export default router;
