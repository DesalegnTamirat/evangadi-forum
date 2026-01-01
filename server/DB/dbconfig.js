import mysql from "mysql2/promise";
import express from "express";
const app = express();
const dbconnection = mysql.createPool({
  host: "91.204.209.29",
  user: "birhanbz_evangadi-forum-G2",
  password: "+0L7%6UAx[%.=L2z",
  database: "birhanbz_evangadi_forum",
  connectionLimit: 11,
});

export default dbconnection;
