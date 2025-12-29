import {StatusCodes} from 'http-status-codes';
import dbconnection from '../DB/dbconfig.js';
import xss from 'xss'

const postQuestion = async (req, res) => {
    try{
        const {title , description , tag } = req.body;
        const userId = req.user?.userid;
        // for testing purpose hardcoding userId
        // const userId = req.body.userid;         
       // console.log("Incoming userId:", userId);

//validate required fields 
        if(!title || !description || !userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Title, Description and userId required",
            });
        }
        // Validate tag length 
        if(tag && tag.length > 20){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Tag must be less than 20 characters",
            }); 
        }
        // Sanitize inputs to prevent XSS
        const sanitizedTitle = xss(title);
        const sanitizedDescription = xss(description);
        const sanitizedTag = tag ? xss(tag) : null;

        const [result] = await dbconnection.query(
            "INSERT INTO questions(title, description, tag, userid)  VALUES (? , ? , ? , ?)",
            [sanitizedTitle, sanitizedDescription, sanitizedTag, userId]
        );
        res.status(StatusCodes.CREATED).json({
            message: "Question Posted Successfully!",
            questionId: result.insertId,     
            
        });      
    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error posting question",
            error: error.message,
        });
    }
}
export default postQuestion;
