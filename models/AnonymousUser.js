// models/AnonymousUser.js
import mongoose from "mongoose";

const AnonymousUserSchema = new mongoose.Schema({
  pseudonym: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  pin: { type: String, required: true }, // ✅ Add this line
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.AnonymousUser ||
  mongoose.model("AnonymousUser", AnonymousUserSchema);
