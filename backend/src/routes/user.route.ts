
import { Router } from "express";
import { infoUser, updateUser } from "../controllers/UserController";

const router = Router();

router.get("/user/info", infoUser);
router.put("/user/update", updateUser);

export default router;
