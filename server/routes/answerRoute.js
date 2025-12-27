import express from "express";
import { getAnswers } from "../controllers/answerController.js";

const getAnswerRouter = express.Router();

// GET /api/answer/:question_id
getAnswerRouter.get("/answer/:question_id", async (req, res, next) => {
    try {
        await getAnswers(req, res);
    } catch (error) {
    next(error);
    }
});

export default getAnswerRouter;
