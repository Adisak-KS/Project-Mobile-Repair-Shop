import { Router } from "express";
import { createCompany, listCompany } from "../controllers/CompanyController";
const router = Router();

router.post("/company/create", createCompany);
router.get("/company/list", listCompany);

export default router;
