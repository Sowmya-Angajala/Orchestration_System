// import express from "express";
// import Task from "../models/Task.js";
// import { auth } from "../middleware/auth.js";
// import { io } from "../server.js";

// const router = express.Router();

// router.post("/", auth, async (req, res) => {
//   const task = await Task.create(req.body);
//   io.emit("taskCreated", task);
//   res.json(task);
// });

// router.get("/:projectId", auth, async (req, res) => {
//   const tasks = await Task.find({ projectId: req.params.projectId });
//   res.json(tasks);
// });

// const tasks = await Task.find({ projectId: req.params.projectId })
//   .populate("assignedTo", "name email");

// router.put("/:id", auth, async (req, res) => {
//   const task = await Task.findById(req.params.id);

//   if (task.versionNumber !== req.body.versionNumber) {
//     return res.status(409).json({ msg: "Conflict", latest: task });
//   }

//   Object.assign(task, req.body);
//   task.versionNumber++;

//   await task.save();

//   io.emit("taskUpdated", task);

//   res.json(task);
// });

// export default router;


import express from "express";
import Task from "../models/Task.js";
import { auth } from "../middleware/auth.js";
import { io } from "../server.js";
import TaskHistory from "../models/TaskHistory.js";


const router = express.Router();

// ✅ CREATE TASK
router.post("/", auth, async (req, res) => {
  try {
    const task = await Task.create(req.body);

    const populated = await task.populate("assignedTo", "name email");

    io.emit("taskCreated", populated);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ msg: "Error creating task" });
  }
});

// ✅ GET TASKS BY PROJECT
router.get("/:projectId", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      projectId: req.params.projectId,
    }).populate("assignedTo", "name email");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching tasks" });
  }
});

// ✅ UPDATE TASK
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task.versionNumber !== req.body.versionNumber) {
      return res.status(409).json({
        msg: "Version conflict",
        latest: task,
      });
    }

    Object.assign(task, req.body);
    task.versionNumber++;

    await task.save();

    const updated = await task.populate("assignedTo", "name email");

    io.emit("taskUpdated", updated);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Error updating task" });
  }
});


router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task.versionNumber !== req.body.versionNumber) {
      return res.status(409).json({
        msg: "Version conflict",
        latest: task,
      });
    }
    await TaskHistory.create({
      taskId: task._id,
      versionNumber: task.versionNumber,
      data: task.toObject(),
    });

    Object.assign(task, req.body);
    task.versionNumber += 1;

    await task.save();

    const updated = await task.populate("assignedTo", "name");

    io.emit("taskUpdated", updated);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Update failed" });
  }
});

router.get("/:id/history", auth, async (req, res) => {
  const history = await TaskHistory.find({
    taskId: req.params.id,
  }).sort({ versionNumber: -1 });

  res.json(history);
});

export default router;