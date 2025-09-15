import { Router } from "express";
import { createCompany, listCompany } from "../controllers/CompanyController";
const router = Router();

router.post("/create", createCompany);
router.get("/list", listCompany);

export default router;
