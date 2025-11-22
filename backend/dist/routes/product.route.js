"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController_1 = require("../controllers/ProductController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All product/buy routes require authentication
router.get("/buy/list", auth_middleware_1.authenticate, ProductController_1.listProduct);
router.post("/buy/create", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["admin", "user"]), ProductController_1.createProduct);
router.put("/buy/update/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["admin", "user"]), ProductController_1.updateProduct);
router.delete("/buy/remove/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["admin"]), ProductController_1.removeProduct);
router.get("/buy/export", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["admin"]), ProductController_1.exportToExcel);
exports.default = router;
