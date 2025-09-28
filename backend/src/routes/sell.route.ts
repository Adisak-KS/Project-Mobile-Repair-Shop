import { Router } from "express";
import { createSell } from "../controllers/SellController";
const router = Router();

router.post("/sell/create", createSell);

export default router;
