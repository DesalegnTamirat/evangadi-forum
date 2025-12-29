import dbconnection from "../DB/dbconfig.js";
import { StatusCodes } from "http-status-codes";

const postAnswerForQuestion = async (req, res) => {
  const { questionid, answer } = req.body;

  console.log("Question ID:", questionid);
  console.log("Answer:", answer);

  if (!questionid || !answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide both question ID and answer.",
    });
  }

  try {
    const createdBy = req.user.userid;

    await dbconnection.execute(
      "INSERT INTO answers (questionid, userid, answer) VALUES (?, ?, ?)",
      [questionid, createdBy, answer]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Answer posted successfully" });
  } catch (error) {
    console.error("Error posting answer:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

export { postAnswerForQuestion };
