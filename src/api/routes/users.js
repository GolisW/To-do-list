import express from "express";
import {
  createUser,
  loginUser,
  deleteUser,
  updateUser,
} from "../controllers/users.js";

const router = express.Router();

// routes starting with /users
router.post("/createUser", createUser);
router.post("/login", loginUser);
router.delete("/:userID", deleteUser);
router.patch("/:userID", updateUser);

export default router;
