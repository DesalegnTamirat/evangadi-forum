import express from "express";
import dotenv from "dotenv";
import answerRoutes from "./routes/answerRoute.js";
import userRoutes from "./routes/userRoutes.js";
import questionRoutes from "./routes/questionRoute.js";
import authMiddleware from "./middleware/authMiddleware.js";
import dbconnection from "./DB/dbconfig.js";

const app = express();
app.use(express.json());

dotenv.config();
const PORT = process.env.PORT || 5500;

//json packing middleware
app.use(express.json());

// questinRoutes middleware
app.use("/api/question", authMiddleware, questionRoutes);

//userRoutes middleware
app.use("/api/user", userRoutes);

// answerRoutes middlware
app.use("/api/answer", authMiddleware, answerRoutes);

async function startServer() {
  try {
    await dbconnection.execute("SELECT 'test'");
    console.log("Database connected...");
    app.listen(PORT);
    console.log(`Server running on: http://localhost:${PORT}`);
  } catch (error) {
    console.log("Database connection failed: ", error.message);
  }
}

startServer();
