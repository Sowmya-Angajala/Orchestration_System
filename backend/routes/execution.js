import express from "express";
import Task from "../models/Task.js";
import { detectCycle, getExecutionOrder } from "../utils/executionEngine.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/:projectId/compute-execution", auth, async (req, res) => {
  const tasks = await Task.find({ projectId: req.params.projectId });

  // ❌ Cycle check
  if (detectCycle(tasks)) {
    return res.status(400).json({ msg: "Cycle detected in dependencies" });
  }

  // ✅ Get order
  const orderedTasks = getExecutionOrder(tasks);

  const blockedTasks = [];
  const readyTasks = [];

  const completedSet = new Set(
    tasks.filter(t => t.status === "Completed").map(t => t._id.toString())
  );

  const runningResources = new Set();

  for (let task of orderedTasks) {
    const depsCompleted = task.dependencies.every(dep =>
      completedSet.has(dep.toString())
    );

    if (!depsCompleted) {
      blockedTasks.push(task);
      continue;
    }

    if (runningResources.has(task.resourceTag)) {
      blockedTasks.push(task);
      continue;
    }

    if (task.status === "Failed" && task.retryCount >= task.maxRetries) {
      blockedTasks.push(task);
      continue;
    }

    runningResources.add(task.resourceTag);
    readyTasks.push(task);
  }

  res.json({
    executionOrder: orderedTasks,
    readyTasks,
    blockedTasks,
  });
});

export default router;

router.post("/:projectId/simulate", auth, async (req, res) => {
  const { availableHours, failedTaskIds = [] } = req.body;

  let tasks = await Task.find({ projectId: req.params.projectId });

  if (detectCycle(tasks)) {
    return res.status(400).json({ msg: "Cycle detected" });
  }

  // Mark failed tasks
  const failedSet = new Set(failedTaskIds);

  tasks = tasks.map(t => {
    if (failedSet.has(t._id.toString())) {
      t.status = "Failed";
    }
    return t;
  });

  const ordered = getExecutionOrder(tasks);

  const completed = new Set();
  const selectedTasks = [];
  const blockedTasks = [];
  const skippedTasks = [];

  let remainingHours = availableHours;
  let totalPriorityScore = 0;
  const usedResources = new Set();

  for (let task of ordered) {
    const depsOk = task.dependencies.every(dep =>
      completed.has(dep.toString())
    );

    if (!depsOk || task.status === "Failed") {
      blockedTasks.push(task);
      continue;
    }

    if (usedResources.has(task.resourceTag)) {
      skippedTasks.push(task);
      continue;
    }

    if (task.estimatedHours > remainingHours) {
      skippedTasks.push(task);
      continue;
    }

    // select task
    selectedTasks.push(task);
    completed.add(task._id.toString());
    usedResources.add(task.resourceTag);

    remainingHours -= task.estimatedHours;
    totalPriorityScore += task.priority;
  }

  res.json({
    executionOrder: ordered,
    selectedTasks,
    blockedTasks,
    skippedTasks,
    totalPriorityScore,
  });
});