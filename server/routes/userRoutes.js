import express from "express";
import { login, register } from "../controller/userController.js";

const router = express.Router();


router.post("/login", login);
router.post("/users/register", register);

export default router;
