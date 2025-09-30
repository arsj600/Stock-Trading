import express from "express";
import { createPost, getPosts, updatePost, deletePost } from "../controllers/postController.js";


const router = express.Router();

router.get("/", getPosts);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
