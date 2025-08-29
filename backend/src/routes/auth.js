import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";

const router = express.Router();

// AUTHENTICATE TOKEN MIDDLEWARE
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Access token is required",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or required token" });
    }
    req.user = decoded;
    next();
  });
};

// SIGNUP API
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Email, password, and name are required" });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const result = await pool.query(
      "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at",
      [email, hashedPassword, name]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      user: result.rows[0],
      token,
    });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// LOGIN API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    //Search for user
    const result = await pool.query(
      "SELECT id, email, password, name FROM users WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Remove password from response
    delete user.password;

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET ME API
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT id, email, name, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// LOGUT API
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    // Handled by client-side
    // TODO: Implement token blacklist
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
