// database connection to be imported from  collaborators
import dbConnection from "../DB/dbconfig.js";
import { StatusCodes } from "http-status-codes";
import { extract } from "keyword-extractor";
import { randomBytes } from "crypto";

async function getAllQuestions(req, res) {
  try {
    // Get all questions from the database (updated to match your schema)
    const [questions] = await dbConnection.execute(
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



export { getAllQuestions};
