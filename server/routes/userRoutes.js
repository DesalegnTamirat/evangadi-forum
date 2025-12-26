import express from "express"

const router = express.Router();

router.post("/login", (req, res) => {
  res.send("login code goes here .... ");
});

export default router;