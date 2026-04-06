import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title } = req.body;

    const task = await Task.create({
      title,
      userId: req.user.userId, // 🔥 JWT se
    });

    res.json({
      message: "Task created 🚀",
      task,
    });
  } catch (err) {
    res.status(500).json({ error: err.message, sucess: false });
  }
});

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.user.userId, // 🔥 important
    }).sort({ createdAt: -1 });

    res.json({
      message: "Task fetched successfully 🚀",
      tasks,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ error: err.message, sucess: false });
  }
});

router.put("/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const newTaskStatusObj = {
      Todo: "In-Progress",
      "In-Progress": "Done",
    };

    task.status = newTaskStatusObj[task.status] || task.status;

    await task.save();

    res.json({
      message: "Task status updated successfully 🚀",
      task,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { title } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true },
    );

    res.json({
      message: "Task edited successfully 🚀",
      task,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // 🔐 optional security (recommended)
    if (task.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted 🚀", success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.patch("/:id/subtasks", async (req, res) => {
  try {
    const { title } = req.body;

    // 🔥 Python call
    const aiRes = await fetch(
      "https://ai-smart-manager.onrender.com/generate-subtasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      },
    );

    const aiData = await aiRes.json();

    const subtasks = aiData.subTasks || [];

    // 🔥 EXISTING TASK UPDATE
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          subTasks: {
            $each: subtasks.map((sub) => ({
              title: sub.title,
            })),
          },
        },
      },
      { new: true },
    );

    res.json({
      message: "Subtasks added 🚀",
      task: updatedTask,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
});

router.patch("/:taskId/subtask/:subtaskId", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    const subtask = task.subTasks.id(req.params.subtaskId);

    subtask.isChecked = !subtask.isChecked;

    await task.save();

    res.json({
      message: "Subtasks status updated 🚀",
      task,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
