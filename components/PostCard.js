"use client";

import { useEffect, useState } from "react";
import PostContent from "./PostContent";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

export default function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState(false); // 🚀 New state for showing comments
  const [loadingComments, setLoadingComments] = useState(false);

  const [commentContent, setCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [replyContent, setReplyContent] = useState({});

  // Post editing
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState(post.content);

  const anonUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("anon_user"))
      : null;

  useEffect(() => {
    if (anonUser && post.likedBy?.includes(anonUser.id)) {
      setLiked(true);
    }
  }, [anonUser, post.likedBy]);

  async function loadComments() {
    if (commentsVisible) {
      // already visible, hide them
      setCommentsVisible(false);
      return;
    }

    setLoadingComments(true);
    try {
      const res = await fetch(`/api/posts/${post._id}/comments`);
      const data = await res.json();
      setComments(data);
      setCommentsVisible(true);
    } catch (err) {
      console.error("Error loading comments:", err.message);
    } finally {
      setLoadingComments(false);
    }
  }

  async function handleReplySubmit(commentId) {
    const content = replyContent[commentId]?.trim();
    if (!content) return;

    try {
      const res = await fetch(
        `/api/posts/${post._id}/comments/${commentId}/replies`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            pseudonym: anonUser?.pseudonym || "Anonymous",
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to reply");

      const newReply = await res.json();

      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? { ...c, replies: [newReply, ...(c.replies || [])] }
            : c
        )
      );

      setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
    } catch (err) {
      console.error("Error replying:", err.message);
    }
  }

  return (
    <div className="p-4 border rounded mb-6">
      <PostContent
        post={post}
        isEditing={isEditingPost}
        setIsEditing={setIsEditingPost}
        newContent={newPostContent}
        setNewContent={setNewPostContent}
        likes={likes}
        setLikes={setLikes}
        liked={liked}
        setLiked={setLiked}
      />

      {/* Comment button */}
      <button
        onClick={loadComments}
        className="mt-2 text-sm text-blue-600 hover:underline"
      >
        {commentsVisible ? "Hide comments" : "Show comments"}
      </button>

      {/* Loading state */}
      {loadingComments && <p className="text-gray-500 text-sm mt-2">Loading comments...</p>}

      {/* Comment section */}
      {commentsVisible && (
        <>
          <CommentForm
            commentContent={commentContent}
            setCommentContent={setCommentContent}
            postId={post._id}
            anonUser={anonUser}
            setComments={setComments}
          />

          <CommentList
            comments={comments}
            anonUser={anonUser}
            editingCommentId={editingCommentId}
            setEditingCommentId={setEditingCommentId}
            editingContent={editingContent}
            setEditingContent={setEditingContent}
            postId={post._id}
            setComments={setComments}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            handleReplySubmit={handleReplySubmit}
          />
        </>
      )}
    </div>
  );
}
