import { Router } from "express";
import {
  createUser,
  infoUser,
  listUser,
  removeUser,
  updateUser,
  updateUserInfo,
} from "../controllers/UserController";

const router = Router();

router.get("/user/list", listUser);
router.post("/user/create", createUser);
router.put("/user/update/:id", updateUser);
router.delete("/user/remove/:id", removeUser);


router.get("/user/info", infoUser);
router.put("/user/update", updateUserInfo);

export default router;
