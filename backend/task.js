import mongoose from "mongoose";


const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    priority: Number,
    estimatedHours: Number,
    status: {
      type: String,
      enum: ["Pending", "Running", "Completed", "Failed", "Blocked"],
      default: "Pending",
    },
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    resourceTag: String,
    maxRetries: Number,
    retryCount: { type: Number, default: 0 },
    versionNumber: { type: Number, default: 1 },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);