import { Router } from "express";
import {
  confirmSell,
  createSell,
  listSell,
  removeSell,
} from "../controllers/SellController";
const router = Router();

router.get("/sell/list", listSell);
router.post("/sell/create", createSell);
router.delete("/sell/remove/:id", removeSell);
router.get("/sell/confirm", confirmSell);


export default router;
