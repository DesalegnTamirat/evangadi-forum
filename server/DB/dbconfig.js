import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const dbconnection = mysql.createPool({
<<<<<<< HEAD
  host: "91.204.209.29",
  user: "birhanbz_evangadi-forum-G2",
  password: "+0L7%6UAx[%.=L2z",
  database: "birhanbz_evangadi_forum",
=======
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
>>>>>>> 56ff55ab4453c3ba2de8a4ad51ad40bdba011632
  connectionLimit: 11,
});

export default dbconnection;
