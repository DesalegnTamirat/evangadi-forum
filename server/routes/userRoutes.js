import express from "express";
import { login, register, checkUser } from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);

// Register Route
router.post("/register", register);
// Check User
router.get("/checkUser", authMiddleware, checkUser);

export default router;
