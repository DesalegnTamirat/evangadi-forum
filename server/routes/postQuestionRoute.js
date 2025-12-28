import express from 'express';
import postQuestion from '../controller/postQuestionController.js'

const postQuestionRouter = express.Router();

postQuestionRouter.post("/question", postQuestion);


export default postQuestionRouter;