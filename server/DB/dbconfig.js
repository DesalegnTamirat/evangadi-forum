import mysql from "mysql2/promise";
const dbconnection = mysql.createPool({
  host: "localhost",
  user: "evangadi-admin",
  password: "evangadi@123admin",
  database: "evangadi_forum",
  connectionLimit: 11,
});

export default dbconnection;
