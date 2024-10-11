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

// MIDDLEWARE CORS
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5500",
    credentials: true,
  })
);
app.use(cookieParser());

// Preflight request (OPTIONS)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5500");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

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
