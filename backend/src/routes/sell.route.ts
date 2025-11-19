import { Router } from "express";
import {
  confirmSell,
  createSell,
  dashboardSell,
  historySell,
  infoSell,
  listSell,
  removeSell,
} from "../controllers/SellController";
const router = Router();

router.get("/sell/list", listSell);
router.post("/sell/create", createSell);
router.delete("/sell/remove/:id", removeSell);
router.get("/sell/confirm", confirmSell);

router.get("/sell/dashboard/:year", dashboardSell);
router.get("/sell/history", historySell);
router.get("/sell/info/:id", infoSell);


export default router;
