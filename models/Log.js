// models/Log.js
import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., "LOGIN", "LIKE", "ERROR"
  message: { type: String },
  ip: { type: String },
  userId: { type: String }, // from anon_user.id
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Log || mongoose.model("Log", LogSchema);
