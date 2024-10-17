import express from "express";
import {
  createUser,
  loginUser,
  deleteUser,
  updateUser,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// routes starting with /users
router.post("/createUser", createUser);
router.post("/login", loginUser);
router.delete("/:userID", verifyToken, deleteUser);
router.patch("/:userID", verifyToken, updateUser);

export default router;
