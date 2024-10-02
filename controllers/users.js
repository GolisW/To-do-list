import { db } from "../server.js";

// Get all users
export const getUsers = (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      res.status(500).send("Error fetching users");
      return;
    }
    res.json(results);
  });
};

// Create new user
export const createUser = (req, res) => {
  const { username, email, password } = req.body;

  db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, password],
    (err, result) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        res.status(400).send("Error creating user");
        return;
      }
      res.status(201).send("User created successfully");
    }
  );
};

// Get specific user NOT READY NOW
export const getUser = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        res.status(500).send("Server error");
        return;
      }

      if (results.length === 0) {
        return res.status(401).send("Invalid email or password");
      }

      const user = results[0];

      res.status(200).json({
        message: "Login successful",
        user: user,
      });
    }
  );
};

// Delete user
export const deleteUser = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE userid = ?", [id], (err, result) => {
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

// Update username
export const updateUser = (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  db.query(
    "UPDATE users SET username = ? WHERE UserID = ?",
    [username, id],
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
