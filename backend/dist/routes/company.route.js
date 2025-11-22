"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CompanyController_1 = require("../controllers/CompanyController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All company routes require authentication
router.post("/company/create", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["admin"]), CompanyController_1.createCompany);
router.get("/company/list", auth_middleware_1.authenticate, CompanyController_1.listCompany);
exports.default = router;
