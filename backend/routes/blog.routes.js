import express from "express";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllBlogs);

router.get("/:id", getBlogById);

router.post("/", protectRoute, createBlog);

router.put("/:id", protectRoute, updateBlog);

router.delete("/:id", protectRoute, deleteBlog);

export default router;
