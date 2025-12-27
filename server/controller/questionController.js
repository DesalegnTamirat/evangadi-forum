// database connection to be imported from  collaborators 
import { StatusCodes } from "http-status-codes";

async function getAllQuestions(req, res) {
  try {
    // Get all questions from the database (updated to match your schema)
    const [questions] = await dbConnection.execute(
      `SELECT 
        q.question_id,
        q.title,
        q.description,
        q.tag,
        q.created_at,
        q.user_id,
        u.user_name,
        u.first_name,
        u.last_name
      FROM questionTable q 
      JOIN userTable u ON q.user_id = u.user_id 
      ORDER BY q.created_at DESC`
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

export { getAllQuestions };
