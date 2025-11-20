import { Router } from "express";
import {
  createProduct,
  exportToExcel,
  listProduct,
  removeProduct,
  updateProduct,
} from "../controllers/ProductController";
const router = Router();

router.get("/buy/list", listProduct);
router.post("/buy/create", createProduct);
router.put("/buy/update/:id", updateProduct);
router.delete("/buy/remove/:id", removeProduct);
router.get("/buy/export", exportToExcel);

export default router;
