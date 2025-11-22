import { Router } from "express";
import {
  createUser,
  infoUser,
  listUser,
  removeUser,
  updateUser,
  updateUserInfo,
} from "../controllers/UserController";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

// Admin routes - require authentication and admin level
router.get("/user/list", authenticate, authorize(["admin"]), listUser);
router.post("/user/create", authenticate, authorize(["admin"]), createUser);
router.put("/user/update/:id", authenticate, authorize(["admin"]), updateUser);
router.delete("/user/remove/:id", authenticate, authorize(["admin"]), removeUser);

// User routes - require authentication only
router.get("/user/info", authenticate, infoUser);
router.put("/user/update", authenticate, updateUserInfo);

export default router;
