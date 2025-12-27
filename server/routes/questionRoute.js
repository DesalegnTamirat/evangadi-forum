import { Router } from "express";
const router = Router();
import { getAllQuestions } from "../controller/questionController";

router.get("/", getAllQuestions);
