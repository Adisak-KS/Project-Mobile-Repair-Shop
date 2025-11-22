"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ServiceController_1 = require("../controllers/ServiceController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All service routes require authentication
router.get("/service/list", auth_middleware_1.authenticate, ServiceController_1.listService);
router.post("/service/create", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["admin"]), ServiceController_1.createService);
router.put("/service/update/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["admin"]), ServiceController_1.updateService);
router.delete("/service/remove/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["admin"]), ServiceController_1.removeService);
exports.default = router;
