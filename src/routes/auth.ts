import { Router } from "express";
import { login, register, updateUser } from "../controllers/auth.controller";

const router = Router();

router.post("/sign-up", register);
router.post("/sign-in", login);
router.put("/update/:userId", updateUser);

export default router;
