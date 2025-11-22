import { Router } from "express";
import {
  createProduct,
  exportToExcel,
  listProduct,
  removeProduct,
  updateProduct,
} from "../controllers/ProductController";
import { authenticate, authorize } from "../middleware/auth.middleware";
const router = Router();

/**
 * @swagger
 * /buy/list:
 *   get:
 *     tags:
 *       - Products
 *     summary: แสดงรายการสินค้าทั้งหมด
 *     description: ดึงข้อมูลสินค้าทั้งหมดในสต็อก
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: แสดงรายการสินค้าสำเร็จ
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
 * /buy/create:
 *   post:
 *     tags:
 *       - Products
 *     summary: เพิ่มสินค้าเข้าสต็อก
 *     description: สร้างรายการสินค้าใหม่หรือเพิ่มจำนวนสินค้าเดิม (Admin และ User)
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
 *               - barcode
 *               - qty
 *               - cost
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15 Pro Max 256GB
 *                 description: ชื่อสินค้า
 *               barcode:
 *                 type: string
 *                 example: 8850999320102
 *                 description: บาร์โค้ดสินค้า
 *               qty:
 *                 type: integer
 *                 example: 5
 *                 description: จำนวนสินค้า (ต้องน้อยกว่า 1000)
 *               cost:
 *                 type: number
 *                 format: float
 *                 example: 35000
 *                 description: ราคาทุน
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 42000
 *                 description: ราคาขาย
 *     responses:
 *       201:
 *         description: เพิ่มสินค้าสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardResponse'
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง หรือจำนวนเกิน 1000
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
 * /buy/update/{id}:
 *   put:
 *     tags:
 *       - Products
 *     summary: แก้ไขข้อมูลสินค้า
 *     description: แก้ไขข้อมูลสินค้าตาม ID (Admin และ User)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15 Pro Max 512GB
 *                 description: ชื่อสินค้า
 *               barcode:
 *                 type: string
 *                 example: 8850999320103
 *                 description: บาร์โค้ดสินค้า
 *               cost:
 *                 type: number
 *                 format: float
 *                 example: 38000
 *                 description: ราคาทุน
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 45000
 *                 description: ราคาขาย
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
 *         description: ไม่มีสิทธิ์เข้าถึง
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: ไม่พบสินค้า
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
 * /buy/remove/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: ลบสินค้า
 *     description: ลบสินค้าออกจากระบบตาม ID (เฉพาะ Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *         example: 1
 *     responses:
 *       200:
 *         description: ลบสินค้าสำเร็จ
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
 *         description: ไม่พบสินค้า
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
 * /buy/export:
 *   get:
 *     tags:
 *       - Products
 *     summary: ส่งออกข้อมูลสินค้าเป็น Excel
 *     description: ส่งออกรายการสินค้าทั้งหมดเป็นไฟล์ Excel (เฉพาะ Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ส่งออกข้อมูลสำเร็จ
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
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

router.get("/buy/list", authenticate, listProduct);
router.post("/buy/create", authenticate, authorize(["admin", "user"]), createProduct);
router.put("/buy/update/:id", authenticate, authorize(["admin", "user"]), updateProduct);
router.delete("/buy/remove/:id", authenticate, authorize(["admin"]), removeProduct);
router.get("/buy/export", authenticate, authorize(["admin"]), exportToExcel);

export default router;
