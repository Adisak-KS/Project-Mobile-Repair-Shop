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

// All product/buy routes require authentication
router.get("/buy/list", authenticate, listProduct);
router.post("/buy/create", authenticate, authorize(["admin", "user"]), createProduct);
router.put("/buy/update/:id", authenticate, authorize(["admin", "user"]), updateProduct);
router.delete("/buy/remove/:id", authenticate, authorize(["admin"]), removeProduct);
router.get("/buy/export", authenticate, authorize(["admin"]), exportToExcel);

export default router;
