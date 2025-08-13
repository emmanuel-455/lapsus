import { useState } from "react";

export default function CommentForm({
  commentContent,
  setCommentContent,
  postId,
  anonUser,
  setComments,
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // If user is not logged in, show a message instead of the form
  if (!anonUser) {
    return (
      <p className="text-sm text-gray-500 mt-4 italic">
        Sign in to comment.
      </p>
    );
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    setError(null);

    const content = commentContent.trim();
    if (!content) return;

    try {
      setSubmitting(true);

      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          pseudonym: anonUser?.pseudonym || "Anonymous",
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to post comment");
      }

      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setCommentContent("");
    } catch (err) {
      console.error("Error posting comment:", err.message);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleCommentSubmit} className="mt-4">
      <input
        type="text"
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="Write a comment..."
        className="w-full border outline-none p-2 rounded mb-2"
      />

      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-[#3C0061] text-white px-4 py-1 rounded disabled:opacity-50"
      >
        {submitting ? "Posting..." : "Comment"}
      </button>
    </form>
  );
}
