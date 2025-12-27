import { StatusCodes } from "http-status-codes";
// import dbConnection from "../db/db.config.js";

async function getAnswers(req, res) {
    const { question_id } = req.params;

  // Validate question_id
    const questionIdNum = parseInt(question_id, 10);
    if (isNaN(questionIdNum)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid question_id",
    });
}

try {
    // Check if question exists
    const [question] = await dbConnection.query(
        "SELECT question_id FROM question WHERE question_id = ?",
        [questionIdNum]
    );

    if (question.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
        message: "Question not found",
    });
    }

    // Get answers for the question
    const [answers] = await dbConnection.query(
      "SELECT * FROM answer WHERE question_id = ?",
        [questionIdNum]
    );

    res.status(StatusCodes.OK).json({
        answers,
    });
} catch (error) {
    console.error("Error getting answers:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
    });
}
}

export { getAnswers };
