import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/task.js";
import { verifyToken } from "./routes/auth.js";

const app = express();

// ✅ IMPORTANT — CORS
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log("🔥", req.method, req.url);
  next();
});
app.use("/auth", authRoutes);
app.use("/tasks", verifyToken, taskRoutes);

app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected 🚀");

    app.listen(8000, () => {
      console.log("Server started on port 5000 🚀");
    });
  })
  .catch((err) => console.log(err));
