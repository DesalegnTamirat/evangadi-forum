import express from "express";
import { login, register, checkUser } from "../controller/userController.js";

const router = express.Router();

router.post("/login", login);

// Register Route
router.post("/register", register);
// Check User
router.get("/checkUser", checkUser);

export default router;
