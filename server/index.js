import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import answerRoutes from "./routes/answerRoute.js";
import userRoutes from "./routes/userRoutes.js";
import questionRoutes from "./routes/questionRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import voteRoutes from "./routes/voteRoute.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import categoryRoutes from "./routes/categoryRoute.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import dbconnection from "./DB/dbconfig.js";
import authMiddleware from "./middleware/authMiddleware.js";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Headers
app.use(helmet({
    crossOriginResourcePolicy: false, // Allow local images to be loaded
}));

// Rate Limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // set `RateLimit` and `RateLimit-Policy` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: "Too many requests from this IP, please try again after 15 minutes"
});

// Apply the rate limiting middleware to all requests.
app.use("/api/", limiter);

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : ["http://localhost:5173"];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Enable CORS with the specified options
app.use(cors(corsOptions));

app.use(express.json());

// Serve static files for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5500;

app.get("/test", (req, res) => {
  res.send("API is running");
});

// question routes middleware
app.use("/api/question", authMiddleware, questionRoutes);

// userRoutes middleware
app.use("/api/user", userRoutes);

// chatRoutes middleware
app.use("/api/chat", authMiddleware, chatRoutes);

// answerRoutes middleware
app.use("/api/answer", authMiddleware, answerRoutes);

// voteRoutes middleware
app.use("/api/vote", authMiddleware, voteRoutes);

// bookmarkRoutes middleware
app.use("/api/bookmark", authMiddleware, bookmarkRoutes);

// categoryRoutes middleware
app.use("/api/category", authMiddleware, categoryRoutes);

// notificationRoutes middleware
app.use("/api/notification", authMiddleware, notificationRoutes);

async function startServer() {
  try {
    await dbconnection.$connect();
    console.log("Database connected...");
    app.listen(PORT);
    console.log(`Server running on: http://localhost:${PORT}`);
  } catch (error) {
    console.log("Database connection failed: ", error.message);
  }
}

startServer();
