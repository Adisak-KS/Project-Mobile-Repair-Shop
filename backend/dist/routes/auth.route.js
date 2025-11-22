"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const router = (0, express_1.Router)();
router.post("/auth/signin", AuthController_1.signIn);
router.post("/auth/signup", AuthController_1.signUp);
exports.default = router;
