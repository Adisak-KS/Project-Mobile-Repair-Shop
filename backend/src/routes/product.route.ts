import { Router } from "express";
import {
  createProduct,
  listProduct,
  removeProduct,
  updateProduct,
} from "../controllers/ProductController";
const router = Router();

router.get("/buy/list", listProduct);
router.post("/buy/create", createProduct);
router.put("/buy/update/:id", updateProduct);
router.delete("/buy/remove/:id", removeProduct);

export default router;
