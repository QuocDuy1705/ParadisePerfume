import express from "express";
import {
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublish,
} from "../controllers/blogController.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllBlogs);

// Admin routes (must be before /:slug to avoid conflicts)
router.get("/id/:id", protect, isAdmin, getBlogById);
router.post("/", protect, isAdmin, createBlog);
router.put("/:id", protect, isAdmin, updateBlog);
router.delete("/:id", protect, isAdmin, deleteBlog);
router.patch("/:id/publish", protect, isAdmin, togglePublish);

// Public slug route (must be last to avoid conflicts)
router.get("/:slug", getBlogBySlug);

export default router;
