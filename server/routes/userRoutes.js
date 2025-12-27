import express from "express";
import { login } from "../controller/userController.js";

const router = express.Router();

router.post("/login", login);

export default router;
