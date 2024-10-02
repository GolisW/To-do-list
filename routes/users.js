import express from "express";
import {
  getUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
} from "../controllers/users.js";

const router = express.Router();

// all routes starting with /users
router.get("/", getUsers);

router.post("/", createUser);

router.post("/login", getUser);

router.delete("/:id", deleteUser);

router.patch("/:id", updateUser);

export default router;
