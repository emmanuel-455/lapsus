// models/notification.js
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // who will receive it (post owner)
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    type: { type: String, enum: ["LIKE"], default: "LIKE" },
    totalLikes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models?.Notification || mongoose.model("Notification", NotificationSchema);
