import { Router } from "express";
const router = Router();
import { postAnswerForQuestion } from "../controller/answerController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.post("/", authMiddleware, postAnswerForQuestion);

export default router;
