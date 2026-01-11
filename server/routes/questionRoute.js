import { Router } from "express";

import authMiddleware from "../middleware/authMiddleware.js";
const router = Router();
import {
  getAllQuestions,
  getSingleQuestion,
  postQuestion,
} from "../controller/questionController.js";

// GET all questions (public)
router.get("/", getAllQuestions);

// POST a new question (requires auth)
router.post("/", authMiddleware, postQuestion);

// GET a single question (public)
router.get("/:questionid", getSingleQuestion);

export default router;
