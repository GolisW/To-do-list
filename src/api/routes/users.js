import express from "express";
import {
  createUser,
  loginUser,
  deleteUser,
  updateUser,
} from "../controllers/users.js";
import { checkAuth } from "../auth.js";

const router = express.Router();

// routes starting with /users
router.post("/createUser", createUser);
router.post("/login", loginUser);

// routes starting with /protected
router.delete("/:id", checkAuth, deleteUser);
router.patch("/:id", checkAuth, updateUser);

export default router;
