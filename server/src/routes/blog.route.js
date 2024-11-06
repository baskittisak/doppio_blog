import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlog,
  getBlogById,
  updateBlog,
} from "../controllers/blog.controller.js";
import { authCheckToken } from "../middleware/auth.middleware.js";
import { validateBodyRequest } from "../middleware/validate.middleware.js";
import { typeBlog } from "../models/blog.model.js";

export const router = express.Router();

router.post("/blog", authCheckToken, validateBodyRequest(typeBlog), createBlog);
router.get("/blogs", authCheckToken, getAllBlog);
router.get("/blog/:id", authCheckToken, getBlogById);
router.put(
  "/blog/:id",
  authCheckToken,
  validateBodyRequest(typeBlog),
  updateBlog
);
router.delete("/blog/:id", authCheckToken, deleteBlog);
