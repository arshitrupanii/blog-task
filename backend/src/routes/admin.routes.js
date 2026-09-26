import express from "express";
import { register, login, getProfile } from "../controllers/admin.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", register);

router.post("/login", login);

router.get("/profile", protectRoute, getProfile);

export default router;
