import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mysql from "mysql";
import cors from "cors";
import { checkAuth } from "./auth.js";
import dotenv from "dotenv";
dotenv.config();

import usersRoutes from "./routes/users.js";

const app = express();
const PORT = 5000;

// MIDDLEWARE
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// MySQL CONNECTION
export const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// CONNECT TO MySQL
db.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Server connected successful to MySQL: " + connection.threadId);
});

// ENDPOINTS
app.use("/users", usersRoutes);

app.get("/protected", checkAuth, (req, res) => {
  res.status(200).json({ message: "Authorized!" });
});

app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);
