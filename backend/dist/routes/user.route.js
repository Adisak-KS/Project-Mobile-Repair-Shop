"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Admin routes - require authentication and admin level
router.get("/user/list", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["admin"]), UserController_1.listUser);
router.post("/user/create", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["admin"]), UserController_1.createUser);
router.put("/user/update/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["admin"]), UserController_1.updateUser);
router.delete("/user/remove/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["admin"]), UserController_1.removeUser);
// User routes - require authentication only
router.get("/user/info", auth_middleware_1.authenticate, UserController_1.infoUser);
router.put("/user/update", auth_middleware_1.authenticate, UserController_1.updateUserInfo);
exports.default = router;
