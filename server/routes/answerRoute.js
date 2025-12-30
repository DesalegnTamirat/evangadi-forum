import express from "express";
import { getAnswers } from "../controller/answerController.js";


const router = express.Router();

router.get("/:question_id", getAnswers);

export default router;
