// database connection to be imported from  collaborators
import dbconnection from "../DB/dbconfig.js";
import { StatusCodes } from "http-status-codes";
import { extract } from "keyword-extractor";
import { randomBytes } from "crypto";

async function getAllQuestions(req, res) {
  try {
    // Get all questions from the database (updated to match your schema)
    const [questions] = await dbconnection.execute(
      `SELECT
        q.questionid,
        q.title,
        q.description,
        q.tag,
        q.createdat,
        q.userid,
        u.username,
        u.firstname,
        u.lastname
      FROM questions q
      JOIN users u ON q.userid = u.userid
      ORDER BY q.createdat DESC`
    );

    // Check if the questions array is empty
    if (questions.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No questions found.",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Questions retrieved successfully",
      questions: questions,
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred",
      error: error.message,
    });
  }
}

// async function getAllQuestions(req, res) {
//   try {
//     // Get all questions with answer counts
//     const [questions] = await dbConnection.execute(
//       `SELECT
//         q.questionid,
//         q.title,
//         q.description,
//         q.tag,
//         q.createdat,
//         q.userid,
//         u.username,
//         u.firstname,
//         u.lastname,
//         COUNT(a.answerid) as answer_count
//       FROM questions q
//       JOIN users u ON q.userid = u.userid
//       LEFT JOIN answers a ON q.questionid = a.questionid
//       GROUP BY q.questionid
//       ORDER BY q.createdat DESC`
//     );

//     // Format the response
//     const formattedQuestions = questions.map((question) => ({
//       question_id: question.questionid,
//       title: question.title,
//       description:
//         question.description.length > 200
//           ? question.description.substring(0, 200) + "..."
//           : question.description,
//       tag: question.tag,
//       created_at: question.createdat,
//       user: {
//         user_id: question.userid,
//         user_name: question.username,
//         first_name: question.firstname,
//         last_name: question.lastname,
//       },
//       answer_count: parseInt(question.answer_count),
//     }));

//     // Check if the questions array is empty
//     if (formattedQuestions.length === 0) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         success: false,
//         message: "No questions found.",
//       });
//     }

//     return res.status(StatusCodes.OK).json({
//       success: true,
//       message: "Questions retrieved successfully",
//       count: formattedQuestions.length,
//       questions: formattedQuestions,
//     });
//   } catch (error) {
//     console.error("Error in getAllQuestion:", error.message);
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "An unexpected error occurred",
//       error: error.message,
//     });
//   }
// }

const generateTag = (title) => {
  const extractionResult = extract(title, {
    language: "english", // Analyzes English text
    remove_digits: true, // Removes numbers (e.g., "React 16" → "React")
    return_changed_case: true, // Converts to lowercase
    remove_duplicates: true, // Removes duplicate keywords
  });
  return extractionResult.length > 0 ? extractionResult[0] : "general";
};

async function postQuestion(req, res) {
  const { title, description } = req.body;
  console.log(title);

  // Check for missing items
  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Please provide all required fields!",
    });
  }
  // Add these checks after validating required fields
  if (title.length < 10) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Title should be at least 10 characters long",
    });
  }

  if (description.length < 10) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Description should be at least 10 characters long",
    });
  }
  if (!req.user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authorization Invalid" });
  }

  try {
    // get userid from user
    const { userid } = req.user;

    // get a unique identifier for questionid so two questions do not end up having the same id. crypto built in node module.
    const questionid = randomBytes(16).toString("hex");

    const tag = generateTag(title);

    // Insert question into database
    await dbconnection.execute(
      "INSERT INTO questions (questionid, userid, title, description, tag, createdat) VALUES (?,?,?,?,?,?)",
      [questionid, userid, title, description, tag, new Date()]
    );

    // After inserting, you might want to return the question data
    return res.status(StatusCodes.CREATED).json({
      message: "Question created successfully",
      question: {
        questionid,
        title,
        description,
        tag,
        userid,
        createdat: new Date(),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An unexpected error occurred.",
    });
  }
}

async function getSingleQuestion(req, res) {
  let { questionid } = req.params;
  console.log("Original question_id:", questionid);
  // console.log("Original question_id:", JSON.stringify(question_id));

  // Remove whitespace AND hyphens
  questionid = questionid.replace(/-/g, "");
  console.log("Cleaned question_id:", JSON.stringify(questionid));

  try {
    const [question] = await dbconnection.execute(
      "SELECT * FROM questions WHERE questionid = ?",
      [questionid]
    );

    if (question.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "Question not found",
        requested_id: questionid,
      });
    }

    return res.status(StatusCodes.OK).json({ question: question[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "An unexpected error occurred",
    });
  }
}

export { getAllQuestions, postQuestion, getSingleQuestion };
