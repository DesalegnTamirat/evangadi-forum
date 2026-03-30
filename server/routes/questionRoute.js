import { Router } from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import {
  getAllQuestions,
  getSingleQuestion,
  postQuestion,
  editQuestion,
  deleteQuestion,
  getStats,
} from "../controller/questionController.js";
const router = Router();

// GET community stats
router.get("/stats", getStats);

// GET all questions
router.get("/", authMiddleware, getAllQuestions);

// POST a new question
router.post("/", authMiddleware, postQuestion);

// GET a single question
router.get("/:questionid", getSingleQuestion);
router.put("/:questionid", authMiddleware, editQuestion);
router.delete("/:questionid", authMiddleware, deleteQuestion);

export default router;
