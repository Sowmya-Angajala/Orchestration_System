import mongoose from "mongoose";

const schema = new mongoose.Schema({
  taskId: mongoose.Schema.Types.ObjectId,
  versionNumber: Number,
  data: Object,
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("TaskHistory", schema);