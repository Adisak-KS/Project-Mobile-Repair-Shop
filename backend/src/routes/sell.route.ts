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
import { authenticate, authorize } from "../middleware/auth.middleware";
const router = Router();

// All sell routes require authentication
router.get("/sell/list", authenticate, listSell);
router.post("/sell/create", authenticate, authorize(["admin", "user"]), createSell);
router.delete("/sell/remove/:id", authenticate, authorize(["admin"]), removeSell);
router.get("/sell/confirm", authenticate, authorize(["admin"]), confirmSell);

router.get("/sell/dashboard/:year", authenticate, dashboardSell);
router.get("/sell/history", authenticate, historySell);
router.get("/sell/info/:id", authenticate, infoSell);

export default router;
