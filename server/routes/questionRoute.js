import { Router } from "express";

import authMiddleware from "../middleware/authMiddleware.js";
const router = Router();
import {
  getAllQuestions,
  postQuestion,
  getSingleQuestion,
} from "../controller/questionController.js";

router.get("/", getAllQuestions);
router.get("/:questionid", getSingleQuestion);
router.post("/",authMiddleware, postQuestion);
// router.get("/", );
export default router;
