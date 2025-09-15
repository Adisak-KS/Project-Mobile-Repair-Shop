import { Router } from "express";
import {
  createProduct,
  listProduct,
  removeProduct,
  updateProduct,
} from "../controllers/ProductController";
const router = Router();

router.get("/list", listProduct);
router.post("/create", createProduct);
router.put("/update/:id", updateProduct);
router.delete("/remove/:id", removeProduct);

export default router;
