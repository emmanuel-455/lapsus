import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  pseudonym: { type: String, required: true },
  content: { type: String, required: true },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, // NEW
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Comment || mongoose.model("Comment", commentSchema);
