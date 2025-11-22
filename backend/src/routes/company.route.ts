import { Router } from "express";
import { createCompany, listCompany } from "../controllers/CompanyController";
import { authenticate, authorize } from "../middleware/auth.middleware";
const router = Router();

// All company routes require authentication
router.post("/company/create", authenticate, authorize(["admin"]), createCompany);
router.get("/company/list", authenticate, listCompany);

export default router;
