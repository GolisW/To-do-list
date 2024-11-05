import { db } from "../app.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.JWT_SECRET;

// CREATE NEW USER
export const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Password hashing
  try {
    const hash = await bcrypt.hash(password, 11);

    // Enrolling a user in the database
    db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hash],
      (err, result) => {
        if (err) {
          console.error("Error executing query: " + err.stack);
          return res.status(400).send("Error creating user");
        }

        // Fetch newly created user
        db.query(
          "SELECT * FROM users WHERE email = ?",
          [email],
          (err, result) => {
            if (err) {
              console.error("Error fetching user: " + err.stack);
              return res.status(500).send("Error fetching user");
            }

            if (result.length === 0) {
              return res.status(404).send("User not found");
            }

            const user = result[0];

            // Generate JWT token
            const token = jwt.sign(
              { userID: user.UserID },
              process.env.JWT_SECRET,
              { expiresIn: "1h" }
            );

            // Generate cookies
            res.cookie("token", token, {
              httpOnly: false,
              secure: false, // true only for HTTPS
              sameSite: "Lax",
            });
            res.cookie("username", user.Username, {
              httpOnly: false,
              secure: false, // true only for HTTPS
              sameSite: "Lax",
            });

            return res.status(201).json({
              message: "User created and logged in successfully",
              token,
              user: {
                username: user.Username,
              },
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error hashing password: " + error.message);
    return res.status(500).send("Server error");
  }
};

// LOGIN USER
export const loginUser = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return res.status(500).send("Server error");
    }

    if (results.length === 0) {
      return res.status(401).send("Invalid credentials");
    }

    const user = results[0];

    // User's password = the hashed password in the database?
    bcrypt.compare(password, user.Password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords: " + err.message);
        return res.status(500).send("Server error");
      }

      if (!isMatch) {
        return res.status(401).send("Invalid credentials");
      }

      //JWT
      const token = jwt.sign({ userID: user.UserID }, secretKey, {
        expiresIn: "1h",
      });

      // Generate cookies
      res.cookie("token", token, {
        httpOnly: false,
        secure: false, // true only for HTTPS
        sameSite: "Lax",
      });
      res.cookie("username", user.Username, {
        httpOnly: false,
        secure: false, // true only for HTTPS
        sameSite: "Lax",
      });

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          username: user.Username,
        },
      });
    });
  });
};

// DELETE USER
export const deleteUser = (req, res) => {
  const userID = req.params.userID;

  if (!userID) {
    return res.status(400).send("Bad Request: No userID provided");
  }

  db.query("DELETE FROM users WHERE UserID = ?", [userID], (err, result) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      res.status(400).send("Error deleting user");
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send("User not found");
    } else {
      res.send("User deleted successfully");
    }
  });
};

// UPDATE USERNAME
export const updateUser = (req, res) => {
  const { username } = req.body;
  const userID = req.params.userID;

  if (!userID) {
    return res.status(400).send("Bad Request: No userID provided");
  }

  db.query(
    "UPDATE users SET Username = ? WHERE UserID = ?",
    [username, userID],
    (err, result) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        res.status(400).send("Error updating user");
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).send("User not found");
      } else {
        res.send("User updated successfully");
      }
    }
  );
};

// FETCH TASKS
export const getTasks = (req, res) => {
  const userID = req.params.userID;

  if (!userID) {
    return res.status(400).send("Bad Request: No userID provided");
  }

  db.query(
    "SELECT id, description, completed FROM todos WHERE UserID = ?",
    [userID],
    (err, results) => {
      if (err) {
        console.error("Error fetching tasks: ", err.stack);
        return res
          .status(500)
          .json({ message: "An error occurred while fetching tasks." });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No tasks found for this user." });
      }

      res.json(results);
    }
  );
};

// ADD TASK
export const addTask = (req, res) => {
  const { description } = req.body;
  const userID = req.params.userID;

  if (!userID) {
    return res.status(400).send("Bad Request: No userID provided");
  }

  db.query(
    "INSERT INTO todos (UserID, description, completed) VALUES (?, ?, ?)",
    [userID, description, 0],
    (err, result) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        res.status(500).send("Error adding task");
        return;
      }
      res.status(201).json({ id: result.insertId, description, completed: 0 });
    }
  );
};

// UPDATE TASK STATUS
export const updateStatus = (req, res) => {
  const { taskId } = req.params;
  const { completed } = req.body;
  const userID = req.params.userID;

  const query = `
    UPDATE todos 
    SET completed = ? 
    WHERE id = ? AND UserID = ?
  `;

  db.query(query, [completed, taskId, userID], (err, results) => {
    if (err) {
      console.error("Error updating task status:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }
    res.status(200).json({ message: "Task status updated successfully" });
  });
};

// UPDATE TASK DESCRIPTION
export const updateDescription = (req, res) => {
  const { taskId } = req.params;
  const { description } = req.body;
  const userID = req.params.userID;

  const sql = "UPDATE todos SET description = ? WHERE id = ? AND UserID = ?";
  db.query(sql, [description, taskId, userID], (err, result) => {
    if (err) {
      console.error("Task update error:", err);
      res.status(500).send("Task update error");
    } else {
      res.status(200).json({ id: taskId, description });
    }
  });
};

// DELETE TASK
export const deleteTask = (req, res) => {
  const { taskId } = req.params;
  const userID = req.params.userID;

  const query = `
    DELETE FROM todos 
    WHERE id = ? AND UserID = ?
  `;

  db.query(query, [taskId, userID], (err, results) => {
    if (err) {
      console.error("Error deleting task:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  });
};

// DELETE ALL TASKS
export const deleteAllTask = (req, res) => {
  const userID = req.params.userID;

  if (!userID) {
    return res.status(400).send("Bad Request: No userID provided");
  }

  db.query("DELETE FROM todos WHERE UserID = ?", [userID], (err, result) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      res.status(500).send("Error deleting task");
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send("User or task not found");
    } else {
      res.send("All tasks deleted successfully");
    }
  });
};
