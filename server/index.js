import express from "express";
import dotenv from "dotenv";
import userRoutes from  './routes/userRoutes.js'
import postQuestionRoutes from './routes/postQuestionRoute.js'
const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;

//json packing middleware
app.use(express.json());

//userRoutes middleware
app.use('/api',userRoutes)

// postQuestionRoutes middleware
app.use('/api',postQuestionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});