import { db } from "../app.js";

// CREATE NEW USER
export const createUser = (req, res) => {
  const { username, email, password } = req.body;

  console.log(req.body);

  db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, password],
    (err, result) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        res.status(400).send("Error creating user");
        return;
      }

      // Login user
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, result) => {
          if (err) {
            console.error("Error fetching user: " + err.stack);
            res.status(500).send("Error fetching user");
            return;
          }

          if (result.length === 0) {
            return res.status(404).send("User not found");
          }

          const user = result[0];
          console.log(user);

          res.cookie("userID", user.UserID, {
            httpOnly: true,
            secure: false, // true only for HTTPS
            sameSite: "Lax",
          });
          res.cookie("username", user.Username, {
            httpOnly: false,
            secure: false, // true only for HTTPS
            sameSite: "Lax",
          });

          res.setHeader("Content-Type", "application/json");
          res.status(201).json({
            message: "User created successfully",
            user: { username: user.Username },
          });
        }
      );
    }
  );
};

// LOGIN USER
export const loginUser = (req, res) => {
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

      res.cookie("userID", user.UserID, { httpOnly: true, secure: true });
      res.status(200).json({
        message: "Login successful",
        user: user,
      });
    }
  );
};

// DELETE USER
export const deleteUser = (req, res) => {
  const userID = req.cookies.userID;

  if (!userID) {
    return res.status(401).send("Unauthorized: No userID in cookies");
  }

  db.query("DELETE FROM users WHERE userid = ?", [userID], (err, result) => {
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
  const userID = req.cookies.userID;

  if (!userID) {
    return res.status(401).send("Unauthorized: No userID in cookies");
  }

  db.query(
    "UPDATE users SET username = ? WHERE UserID = ?",
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
