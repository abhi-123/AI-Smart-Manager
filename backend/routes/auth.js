import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// JWT Verfiy
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1]; // 🔥

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // 🔥
    next();
  } catch {
    res.status(401).json({ error: "Invalid token", status: 401 });
  }
};

// SIGNUP
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.json({ message: "User created successfully 🚀" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
