import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

const app = express();

dotenv.config();
// question routes midware file
import questionRoutes from "./routes/questionRoute.js";
// question routes midware
app.use("/api/question", questionRoutes);

const PORT = process.env.PORT || 3000;

//json packing middleware
app.use(express.json());

//userRoutes middleware
app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});
