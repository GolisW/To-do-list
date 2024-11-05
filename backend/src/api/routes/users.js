import express from "express";
import {
  createUser,
  loginUser,
  deleteUser,
  updateUser,
  getTasks,
  addTask,
  updateDescription,
  updateStatus,
  deleteTask,
  deleteAllTask,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// routes starting with /users
router.post("/createUser", createUser);
router.post("/login", loginUser);
router.delete("/:userID", verifyToken, deleteUser);
router.patch("/:userID", verifyToken, updateUser);

router.get("/:userID/getTasks", verifyToken, getTasks);
router.post("/:userID/add", verifyToken, addTask);
router.put(
  "/:userID/:taskId/updateDescription",
  verifyToken,
  updateDescription
);
router.patch("/:userID/:taskId/updateStatus", verifyToken, updateStatus);
router.delete("/:userID/:taskId/delete", verifyToken, deleteTask);
router.delete("/:userID/deleteAll", verifyToken, deleteAllTask);

export default router;
