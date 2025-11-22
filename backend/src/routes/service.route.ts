import { Router } from "express";
import { createService, listService, removeService, updateService } from "../controllers/ServiceController";
import { authenticate, authorize } from "../middleware/auth.middleware";
const router = Router();

// All service routes require authentication
router.get("/service/list", authenticate, listService);
router.post("/service/create", authenticate, authorize(["admin"]), createService);
router.put("/service/update/:id", authenticate, authorize(["admin"]), updateService);
router.delete("/service/remove/:id", authenticate, authorize(["admin"]), removeService);

export default router;
