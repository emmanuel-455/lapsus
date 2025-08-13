// components/comments/CommentThread.jsx
"use client";

import { useState } from "react";

export default function CommentThread({
  nodes,                 // array (tree roots)
  postId,
  anonUser,
  canInteract = true,    // set to false to block replies/edits for signed-out users
  onCommentAdded,        // callback(newComment)
  onCommentUpdated,      // callback(updatedComment)
}) {
  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Comments</h4>
      {nodes?.length ? (
        nodes.map((node) => (
          <SingleComment
            key={node._id}
            node={node}
            depth={0}
            postId={postId}
            anonUser={anonUser}
            canInteract={canInteract}
            onCommentAdded={onCommentAdded}
            onCommentUpdated={onCommentUpdated}
          />
        ))
      ) : (
        <p className="text-sm text-gray-400">No comments yet.</p>
      )}
    </div>
  );
}

function SingleComment({
  node,
  depth,
  postId,
  anonUser,
  canInteract,
  onCommentAdded,
  onCommentUpdated,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(node.content);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  async function handleEditSave() {
    try {
      const res = await fetch(`/api/posts/${postId}/comments/${node._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editContent,
          pseudonym: anonUser?.pseudonym, // needed for secure checks on server
        }),
      });

      if (!res.ok) throw new Error("Failed to edit comment");

      const updated = await res.json();
      setIsEditing(false);
      onCommentUpdated?.(updated);
    } catch (err) {
      console.error("Error editing comment:", err.message);
    }
  }

  async function handleReply() {
    const content = replyContent.trim();
    if (!content) return;
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          pseudonym: anonUser?.pseudonym || "Anonymous",
          parentComment: node._id,
        }),
      });
      if (!res.ok) throw new Error("Failed to add reply");
      const newReply = await res.json();
      setReplyContent("");
      setShowReplyBox(false);
      onCommentAdded?.(newReply);
    } catch (err) {
      console.error("Error replying:", err.message);
    }
  }

  return (
    <div className="mt-2" style={{ marginLeft: depth * 16 }}>
      {isEditing ? (
        <div className="mb-2">
          <textarea
          className="w-full border p-2 rounded mb-2"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
        />
          <button
            onClick={handleEditSave}
            className="text-sm bg-yellow-600 text-white px-2 py-1 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditContent(node.content);
            }}
            className="text-sm bg-gray-400 text-white px-2 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <p>{node.content}</p>
          <p className="text-xs text-gray-500">— {node.pseudonym}</p>
          <div className="flex space-x-3 mt-1">
            {canInteract && anonUser?.pseudonym === node.pseudonym && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-blue-500 underline"
              >
                Edit
              </button>
            )}

            {canInteract ? (
              <button
                onClick={() => setShowReplyBox((p) => !p)}
                className="text-xs text-green-500 underline"
              >
                Reply
              </button>
            ) : (
              <span className="text-xs text-gray-400">
                Sign in to reply
              </span>
            )}
          </div>
        </>
      )}

      {canInteract && showReplyBox && (
        <div className="mt-2 ml-4">
          <input
            type="text"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full border p-2 rounded mb-1 text-sm"
          />
          <button
            onClick={handleReply}
            className="bg-green-600 text-white px-3 py-1 rounded text-xs"
          >
            Send
          </button>
        </div>
      )}

      {/* children */}
      {node.replies?.length > 0 && (
        <div className="mt-2 border-l pl-3">
          {node.replies.map((child) => (
            <SingleComment
              key={child._id}
              node={child}
              depth={depth + 1}
              postId={postId}
              anonUser={anonUser}
              canInteract={canInteract}
              onCommentAdded={onCommentAdded}
              onCommentUpdated={onCommentUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}
