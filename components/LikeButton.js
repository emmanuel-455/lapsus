"use client";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";

export default function LikeButton({ postId, likes, setLikes, liked, setLiked }) {
  const anonUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("anon_user"))
      : null;

  async function handleLike() {
    if (!anonUser?.id) return;

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: anonUser.id }),
      });

      if (!res.ok) throw new Error("Failed to toggle like");

      const data = await res.json();
      setLikes(data.likes);
      setLiked(data.liked);
    } catch (err) {
      console.error("Error toggling like:", err.message);
    }
  }

  return (
    <motion.button
      onClick={handleLike}
      whileTap={{ scale: 0.8 }}
      className="flex items-center gap-2 mt-2 px-4 py-1 rounded focus:outline-none"
    >
      <motion.div
        initial={false}
        animate={{
          scale: liked ? [1, 1.3, 1] : 1,
          color: liked ? "#ef4444" : "#6b7280",
        }}
        transition={{ duration: 0.3 }}
      >
        <FaHeart size={20} />
      </motion.div>
      <span className="text-gray-700">{likes}</span>
    </motion.button>
  );
}
