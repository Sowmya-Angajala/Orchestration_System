import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User =
  mongoose.models.User || mongoose.model("User", schema);

export default User;