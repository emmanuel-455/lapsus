// app/api/posts/[postId]/comments/[commentId]/route.js
import { dbConnect } from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import mongoose from "mongoose";

export async function PATCH(req, { params }) {
  await dbConnect();
  const { postId, commentId } = params;

  try {
    // Basic id validation
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return new Response(JSON.stringify({ error: "Invalid comment id" }), { status: 400 });
    }

    const { content, pseudonym } = await req.json();

    if (!content || content.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Comment too short" }), { status: 400 });
    }
    if (!pseudonym) {
      return new Response(JSON.stringify({ error: "Missing pseudonym" }), { status: 401 });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return new Response(JSON.stringify({ error: "Comment not found" }), { status: 404 });
    }

    // (Optional) extra guard: ensure the comment belongs to the same post
    if (postId && String(comment.postId) !== String(postId)) {
      return new Response(JSON.stringify({ error: "Comment does not belong to this post" }), { status: 400 });
    }

    // ✅ Only the same pseudonym can edit
    if (comment.pseudonym !== pseudonym) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    comment.content = content;
    await comment.save();

    return new Response(
      JSON.stringify({
        _id: comment._id.toString(),
        content: comment.content,
        pseudonym: comment.pseudonym,
        createdAt: comment.createdAt.toISOString(),
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
