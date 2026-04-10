import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  inviteToken: String,
  inviteExpiry: Date,
 
});


const Project =
  mongoose.models.Project || mongoose.model("Project", schema);

export default Project;