import {StatusCodes} from 'http-status-codes';
import dbconnection from '../DB/dbconfig.js';
import xss from 'xss'

const postQuestion = async (req, res) => {
    try{
        const {title , description , tag } = req.body;
        const userId = req.user?.userid;
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
            "INSERT INTO question(title, description, tag, userid)"
        )

        
    }
}

