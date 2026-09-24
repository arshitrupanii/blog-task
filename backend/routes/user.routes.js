import express from "express";
import { likeBlog, addComment, shareBlog } from "../controllers/blog.controller.js";

const router = express.Router();

router.post("/:id/like", likeBlog);

router.post("/:id/comment", addComment);

router.post("/:id/share", shareBlog);

export default router;
