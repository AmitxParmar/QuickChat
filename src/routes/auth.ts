import { Router } from "express";
import { login, register } from "../controllers/auth.controller";

const router = Router();

router.post("/sign-up", register);
router.post("/sign-in", login);

export default router;
