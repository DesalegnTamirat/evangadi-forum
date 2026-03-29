import express from "express";
import { voteQuestion, voteAnswer } from "../controller/voteController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/question/:questionid", authMiddleware, voteQuestion);
router.post("/answer/:answerid", authMiddleware, voteAnswer);

export default router;
