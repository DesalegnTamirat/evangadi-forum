import dbConnection from "../DB/dbconfig.js";
import { StatusCodes } from "http-status-codes";
import xss from "xss";

async function getAllQuestions(req, res) {
  console.log("getAllQuestions called"); // Debug log
  try {
    const questions = await dbConnection.question.findMany({
      include: {
        user: {
          select: {
            username: true,
            firstname: true,
            lastname: true,
            profile_picture: true,
            reputation: true,
            badges: true,
          },
        },
        bookmarks: {
          where: { userid: req.user?.userid || 0 },
        },
        votes: true,
        _count: {
          select: { answers: true }
        }
      },
      orderBy: {
        questionid: 'desc',
      },
    });

    console.log("Questions found:", questions.length); // Debug log

    // Check if the questions array is empty
    if (questions.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No questions found.",
      });
    }

    const formattedQuestions = questions.map(q => {
      const voteCount = q.votes.reduce((acc, v) => acc + v.vote_type, 0);
      return {
        ...q,
        username: q.user.username,
        firstname: q.user.firstname,
        lastname: q.user.lastname,
        profile_picture: q.user.profile_picture,
        reputation: q.user.reputation,
        badges: q.user.badges,
        vote_count: voteCount,
        answer_count: q._count.answers,
        is_bookmarked: q.bookmarks.length > 0,
        user: undefined,
        votes: undefined,
        bookmarks: undefined,
        _count: undefined
      };
    });

    return res.status(StatusCodes.OK).json({
      message: "Questions retrieved successfully",
      questions: formattedQuestions,
    });
  } catch (error) {
    console.error("Database error:", error); // Debug log
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred",
      error: error.message,
    });
  }
}

// get a single question
async function getSingleQuestion(req, res) {
  const { questionid } = req.params;
  try {
    const question = await dbConnection.question.findUnique({
      where: { questionid: parseInt(questionid, 10) },
      include: {
        user: {
          select: {
            username: true,
            firstname: true,
            lastname: true,
            reputation: true,
            badges: true,
          },
        },
        bookmarks: {
          where: { userid: req.user?.userid || 0 },
        },
        votes: true,
        _count: {
          select: { answers: true }
        }
      },
    });

    // if the questioon not found
    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Question not found.",
      });
    }

    // Increment views
    await dbConnection.question.update({
      where: { questionid: parseInt(questionid, 10) },
      data: { views: { increment: 1 } }
    });

    const userId = req.user?.userid;
    const voteCount = question.votes.reduce((acc, v) => acc + v.vote_type, 0);
    const userVote = question.votes.find(v => v.userid === userId)?.vote_type || 0;

    const formattedQuestion = {
      ...question,
      username: question.user.username,
      firstname: question.user.firstname,
      lastname: question.user.lastname,
      reputation: question.user.reputation,
      badges: question.user.badges,
      vote_count: voteCount,
      user_vote: userVote,
      answer_count: question._count.answers,
      is_bookmarked: question.bookmarks.length > 0,
      user: undefined,
      votes: undefined,
      bookmarks: undefined,
      _count: undefined
    };

    return res.status(StatusCodes.OK).json({
      message: "Question retrieved successfully",
      question: formattedQuestion,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "an error occured, try again",
      error: error.message,
    });
  }
}

const postQuestion = async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const userId = req.user?.userid;

    if (!title || !description || !userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Title, Description and userId required",
      });
    }
    // Validate tag length
    if (tag && tag.length > 20) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Tag must be less than 20 characters",
      });
    }
    // Sanitize inputs to prevent XSS
    const sanitizedTitle = xss(title);
    const sanitizedDescription = xss(description);
    const sanitizedTag = tag ? xss(tag) : null;

    const result = await dbConnection.question.create({
      data: {
        title: sanitizedTitle,
        description: sanitizedDescription,
        tag: sanitizedTag,
        userid: userId
      }
    });

    res.status(StatusCodes.CREATED).json({
      message: "Question Posted Successfully!",
      questionId: result.questionid,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error posting question",
      error: error.message,
    });
  }
};

// EDIT a question
const editQuestion = async (req, res) => {
  try {
    const { questionid } = req.params;
    const { title, description, tag } = req.body;
    const userId = req.user?.userid;

    // Validate question ID
    if (isNaN(questionid)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid question ID",
      });
    }

    // Check if question exists and belongs to the user
    const question = await dbConnection.question.findUnique({
      where: { questionid: parseInt(questionid, 10) },
      select: { userid: true }
    });

    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Question not found.",
      });
    }

    if (question.userid !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You can only edit your own questions.",
      });
    }

    const updateData = {};
    if (title) updateData.title = xss(title);
    if (description) updateData.description = xss(description);
    if (tag) {
      if (tag.length > 20) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Tag must be less than 20 characters",
        });
      }
      updateData.tag = xss(tag);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Nothing to update",
      });
    }

    await dbConnection.question.update({
      where: { 
        questionid: parseInt(questionid, 10),
        userid: userId 
      },
      data: updateData
    });

    return res.status(StatusCodes.OK).json({
      message: "Question updated successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error updating question",
    });
  }
};

// DELETE a question
const deleteQuestion = async (req, res) => {
  try {
    const { questionid } = req.params;
    const userId = req.user?.userid;

    // Validate question ID
    if (isNaN(questionid)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid question ID",
      });
    }

    // Check if question exists and belongs to the user
    const question = await dbConnection.question.findUnique({
      where: { questionid: parseInt(questionid, 10) },
      select: { userid: true }
    });

    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Question not found.",
      });
    }

    if (question.userid !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You can only delete your own questions.",
      });
    }

    await dbConnection.question.delete({
      where: { 
        questionid: parseInt(questionid, 10),
        userid: userId 
      }
    });

    return res.status(StatusCodes.OK).json({
      message: "Question deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error deleting question",
    });
  }
};

export {
  getAllQuestions,
  getSingleQuestion,
  postQuestion,
  editQuestion,
  deleteQuestion,
};
