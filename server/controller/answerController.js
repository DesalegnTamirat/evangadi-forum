import { StatusCodes } from "http-status-codes";
import { createNotification } from "./notificationController.js";
import dbConnection from "../DB/dbconfig.js";
import OpenAI from "openai";
import dotenv from "dotenv";
import xss from "xss";
import { createNotification } from "./notificationController.js";

const getAnswers = async (req, res) => {
  const { question_id } = req.params;

  // validate question_id
  const questionIdNum = parseInt(question_id, 10);
  if (isNaN(questionIdNum)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid question_id",
    });
  }

  try {
    const question = await dbConnection.question.findUnique({
      where: { questionid: questionIdNum },
      select: { questionid: true }
    });

    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Question not found",
      });
    }

    // get answers
    const answers = await dbConnection.answer.findMany({
      where: { questionid: questionIdNum },
      include: {
        user: {
          select: {
            username: true,
            profile_picture: true,
            reputation: true,
          },
        },
        votes: true,
      },
    });

    const userid = req.user?.userid;
    const formattedAnswers = answers.map(a => {
      const voteCount = a.votes.reduce((acc, v) => acc + v.vote_type, 0);
      const userVote = a.votes.find(v => v.userid === userid)?.vote_type || 0;
      return {
        answer_id: a.answerid,
        content: a.answer,
        user_name: a.user.username,
        created_at: a.created_at,
        userid: a.userid,
        profile_picture: a.user.profile_picture,
        reputation: a.user.reputation,
        vote_count: voteCount,
        user_vote: userVote,
      };
    });

    return res.status(StatusCodes.OK).json({ answers: formattedAnswers });
  } catch (error) {
    console.error("Error getting answers:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

//1. Prepare OpenAI Connection
dotenv.config();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Extracts question_id from the URL params
const getAnswerSummary = async (req, res) => {
  const { question_id } = req.params;

  try {
    const question = await dbConnection.question.findUnique({
      where: { questionid: parseInt(question_id, 10) },
      select: { 
        title: true, 
        description: true,
        answers: {
          select: { answer: true }
        }
      }
    });

    if (!question) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found" });
    }

    const answers = question.answers;
    //   insert error response if there is no answer
    if (answers.length === 0) {
      return res
        .status(StatusCodes.OK)
        .json({ summary: "No answers yet to summarize." });
    }

    // 2. Prepare the payload for AI
    // Prepare answers payload for AI summarization
    const allAnswersText = answers
      .map((a, i) => `Answer ${i + 1}: ${a.answer}`)
      .join("\n\n");

    const messages = [
      {
        role: "system",
        content: `You are a high-precision data summarizer. 
        TASK: Summarize technical solutions provided in the text.
        CONSTRAINTS:
        - DO NOT mention "the community," "users," or "the forum."
        - DO NOT use introductory phrases like "It seems like" or "The consensus is."
        - DO NOT explain what you are doing.
        - Start immediately with the core technical summary.
        - Maximum 3 concise sentences.`,
      },
      {
        role: "user",
        content: `Question Title: ${question.title}
        Description: ${question.description}
        
        Answers to summarize:
        ${allAnswersText}`,
      },
    ];

    // 3. Request AI Summary
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      // model:"openai/gpt-oss-20b",
      messages,
      temperature: 0.3, // Lower temperature for more factual summaries
    });

    const summaryText = completion.choices[0].message.content;

    //   4. Return the summary
    return res.status(StatusCodes.OK).json({
      summary: summaryText,
      answerCount: answers.length,
    });
  } catch (error) {
    console.error("Summarization Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to summarize answers" });
  }
};

const postAnswer = async (req, res) => {
  const { question_id, answer } = req.body;

  // validate input
  if (!question_id || !answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "question_id and answer are required",
    });
  }

  const questionIdNum = parseInt(question_id, 10);
  if (isNaN(questionIdNum)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid question_id",
    });
  }

  try {
    const question = await dbConnection.question.findUnique({
      where: { questionid: questionIdNum },
      select: { questionid: true }
    });

    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Question not found",
      });
    }

    // get logged-in user
    const userId = req.user.userid;

    await dbConnection.answer.create({
      data: {
        questionid: questionIdNum,
        userid: userId,
        answer: answer,
      }
    });

    // Create Notification for question author
    const questionAuthor = await dbConnection.question.findUnique({
      where: { questionid: questionIdNum },
      select: { userid: true, title: true }
    });

    if (questionAuthor && questionAuthor.userid !== userId) {
      const shortTitle = questionAuthor.title.substring(0, 30) + "...";
      await createNotification(
        questionAuthor.userid,
        `New answer on your question: "${shortTitle}"`,
        "answer"
      );
    }

    return res.status(StatusCodes.CREATED).json({
      message: "Answer posted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

// Edit Answer
const editAnswer = async (req, res) => {
  const { answer_id } = req.params;
  const { answer } = req.body;
  const userId = req.user?.userid;

  // Validate answer_id
  const answerIdNum = parseInt(answer_id, 10);
  if (isNaN(answerIdNum)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid answer_id",
    });
  }

  // Validate answer content
  if (!answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Answer content is required",
    });
  }

  try {
    const existingAnswer = await dbConnection.answer.findUnique({
      where: { answerid: answerIdNum },
      select: { userid: true }
    });

    if (!existingAnswer) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Answer not found",
      });
    }

    if (existingAnswer.userid !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You can only edit your own answers",
      });
    }

    // Sanitize answer
    const sanitizedAnswer = xss(answer);

    await dbConnection.answer.update({
      where: { 
        answerid: answerIdNum,
        userid: userId 
      },
      data: { answer: sanitizedAnswer }
    });

    return res.status(StatusCodes.OK).json({
      message: "Answer updated successfully",
    });
  } catch (error) {
    console.error("Error editing answer:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

//Delete Answer
const deleteAnswer = async (req, res) => {
  const { answer_id } = req.params;
  const userId = req.user?.userid;

  // Validate answer_id
  const answerIdNum = parseInt(answer_id, 10);
  if (isNaN(answerIdNum)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid answer_id",
    });
  }

  try {
    const existingAnswer = await dbConnection.answer.findUnique({
      where: { answerid: answerIdNum },
      select: { userid: true }
    });

    if (!existingAnswer) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Answer not found",
      });
    }

    if (existingAnswer.userid !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You can only delete your own answers",
      });
    }

    await dbConnection.answer.delete({
      where: { 
        answerid: answerIdNum,
        userid: userId 
      }
    });

    return res.status(StatusCodes.OK).json({
      message: "Answer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting answer:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};
const getSingleAnswer = async (req, res) => {
  const { answer_id } = req.params;

  // Validate answer_id
  const answerIdNum = parseInt(answer_id, 10);
  if (isNaN(answerIdNum)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid answer_id",
    });
  }

  try {
    const answer = await dbConnection.answer.findUnique({
      where: { answerid: answerIdNum },
      include: {
        user: {
          select: { username: true }
        }
      }
    });

    if (!answer) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Answer not found",
      });
    }

    const formattedAnswer = {
      ...answer,
      username: answer.user.username,
      user: undefined
    };

    return res.status(StatusCodes.OK).json({
      answer: formattedAnswer,
    });
  } catch (error) {
    console.error("Error fetching single answer:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export {
  getAnswers,
  postAnswer,
  getAnswerSummary,
  editAnswer,
  deleteAnswer,
  getSingleAnswer,
};
