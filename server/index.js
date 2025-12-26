import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

const app = express();

const port = process.env.PORT || 3000;
app.use(express.json())
app.post('/api/chat', async (req, res) => {
  const input = req.body.prompt;
  const model = "llama-3.3-70b-versatile"
  try {
    const response = await client.responses.create({
      model,
      input, 
      temperature: 0.2,
      max_output_tokens: 1024,
    });
    const answer = response.output_text;
    res.json({answer});
  }
  catch (err) {
    console.log("error: ", err);
    res.json({error: "Failed to generate a response."})
  }
})

app.listen(port, () => {
  console.log(`running on port http://localhost:${port}`);
});
