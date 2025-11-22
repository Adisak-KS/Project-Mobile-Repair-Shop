"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SellController_1 = require("../controllers/SellController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All sell routes require authentication
router.get("/sell/list", auth_middleware_1.authenticate, SellController_1.listSell);
router.post("/sell/create", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["admin", "user"]), SellController_1.createSell);
router.delete("/sell/remove/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["admin"]), SellController_1.removeSell);
router.get("/sell/confirm", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["admin"]), SellController_1.confirmSell);
router.get("/sell/dashboard/:year", auth_middleware_1.authenticate, SellController_1.dashboardSell);
router.get("/sell/history", auth_middleware_1.authenticate, SellController_1.historySell);
router.get("/sell/info/:id", auth_middleware_1.authenticate, SellController_1.infoSell);
exports.default = router;
