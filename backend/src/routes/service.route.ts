import { Router } from "express";
import { createService, listService, removeService, updateService } from "../controllers/ServiceController";
const router = Router();

router.get("/service/list", listService);
router.post("/service/create", createService);
router.put("/service/update/:id", updateService);
router.delete("/service/remove/:id", removeService);

export default router;
