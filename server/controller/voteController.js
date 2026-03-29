import dbConnection from "../DB/dbconfig.js";
import { StatusCodes } from "http-status-codes";

// Helper to update user reputation
const updateReputation = async (userid, points) => {
  try {
    await dbConnection.user.update({
      where: { userid },
      data: { reputation: { increment: points } },
    });
  } catch (error) {
    console.error("Failed to update reputation:", error);
  }
};

const voteQuestion = async (req, res) => {
  const { questionid } = req.params;
  const { vote_type } = req.body;
  const userid = req.user.userid;

  if (vote_type !== 1 && vote_type !== -1) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid vote type" });
  }

  try {
    const question = await dbConnection.question.findUnique({
      where: { questionid: parseInt(questionid, 10) },
      select: { userid: true },
    });

    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Question not found" });
    }

    const authorId = question.userid;
    const isSelfVote = authorId === userid;

    const existingVote = await dbConnection.questionVote.findUnique({
      where: { userid_questionid: { userid, questionid: parseInt(questionid, 10) } },
    });

    if (existingVote) {
      if (existingVote.vote_type === vote_type) {
        // Toggle off
        await dbConnection.questionVote.delete({
          where: { userid_questionid: { userid, questionid: parseInt(questionid, 10) } },
        });
        
        if (!isSelfVote) {
          await updateReputation(authorId, -existingVote.vote_type); // Reverse previous point
        }
        
        return res.status(StatusCodes.OK).json({ message: "Vote removed" });
      } else {
        // Change vote type (e.g., -1 to 1 or 1 to -1)
        await dbConnection.questionVote.update({
          where: { userid_questionid: { userid, questionid: parseInt(questionid, 10) } },
          data: { vote_type },
        });

        if (!isSelfVote) {
          // Change is 2 points (e.g., from -1 to 1 is +2, from 1 to -1 is -2)
          await updateReputation(authorId, vote_type * 2);
        }

        return res.status(StatusCodes.OK).json({ message: "Vote updated" });
      }
    } else {
      // New vote
      await dbConnection.questionVote.create({
        data: { userid, questionid: parseInt(questionid, 10), vote_type },
      });

      if (!isSelfVote) {
        await updateReputation(authorId, vote_type);
      }

      return res.status(StatusCodes.CREATED).json({ message: "Vote added" });
    }
  } catch (error) {
    console.error("Error voting on question:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const voteAnswer = async (req, res) => {
  const { answerid } = req.params;
  const { vote_type } = req.body;
  const userid = req.user.userid;

  if (vote_type !== 1 && vote_type !== -1) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid vote type" });
  }

  try {
    const answer = await dbConnection.answer.findUnique({
      where: { answerid: parseInt(answerid, 10) },
      select: { userid: true },
    });

    if (!answer) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Answer not found" });
    }

    const authorId = answer.userid;
    const isSelfVote = authorId === userid;
    const pointValue = 2; // Answers worth more reputation

    const existingVote = await dbConnection.answerVote.findUnique({
      where: { userid_answerid: { userid, answerid: parseInt(answerid, 10) } },
    });

    if (existingVote) {
      if (existingVote.vote_type === vote_type) {
        // Toggle off
        await dbConnection.answerVote.delete({
          where: { userid_answerid: { userid, answerid: parseInt(answerid, 10) } },
        });

        if (!isSelfVote) {
          await updateReputation(authorId, -(existingVote.vote_type * pointValue));
        }

        return res.status(StatusCodes.OK).json({ message: "Vote removed" });
      } else {
        // Change vote type
        await dbConnection.answerVote.update({
          where: { userid_answerid: { userid, answerid: parseInt(answerid, 10) } },
          data: { vote_type },
        });

        if (!isSelfVote) {
          await updateReputation(authorId, vote_type * (pointValue * 2));
        }

        return res.status(StatusCodes.OK).json({ message: "Vote updated" });
      }
    } else {
      // New vote
      await dbConnection.answerVote.create({
        data: { userid, answerid: parseInt(answerid, 10), vote_type },
      });

      if (!isSelfVote) {
        await updateReputation(authorId, vote_type * pointValue);
      }

      return res.status(StatusCodes.CREATED).json({ message: "Vote added" });
    }
  } catch (error) {
    console.error("Error voting on answer:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export { voteQuestion, voteAnswer };
