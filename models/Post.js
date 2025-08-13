// models/post.js
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    pseudonym: { type: String, required: true },
    userId: { type: String}, // 👈 add this
    likes: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] },
    category: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models?.Post || mongoose.model("Post", PostSchema);

