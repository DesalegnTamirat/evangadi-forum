import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authorization Invalid" });
  }
  const token = authHeader.split(" ")[1];
  console.log(authHeader);
  console.log(token);
  try {
    const { userName, userid } = jwt.verify(authHeader, process.env.JWT_SECRET);
    // ✅ attach to req
    req.user = { userName, userid };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authorization Invalid" });
  }
}

export default authMiddleware;
