import { dbConnect } from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import { logActivity } from "@/lib/logActivity";
import { rateLimit } from "@/utils/rateLimiter";

// GET: Fetch all comments (with replies grouped)
export async function GET(req, { params }) {
  await dbConnect();
  const { id: postId } = params;

  try {
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 }).lean();

    // Format comments for client
    const formatted = comments.map(comment => ({
      ...comment,
      _id: comment._id.toString(),
      createdAt: comment.createdAt.toISOString(),
      parentComment: comment.parentComment ? comment.parentComment.toString() : null,
    }));

    // Group replies under their parent
    const commentTree = formatted.filter(c => !c.parentComment);
    commentTree.forEach(c => {
      c.replies = formatted.filter(r => r.parentComment === c._id);
    });

    return new Response(JSON.stringify(commentTree), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// POST: Add new comment or reply
export async function POST(req, { params }) {
  await dbConnect();
  const { id: postId } = params;

  const limitCheck = rateLimit(req, 5, 60 * 1000);
  if (!limitCheck.success) {
    return new Response(JSON.stringify({ error: limitCheck.message }), { status: 429 });
  }

  try {
    const body = await req.json();
    const { content, pseudonym, parentComment } = body; // parentComment optional

    if (!content || content.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Comment too short" }), { status: 400 });
    }

    const comment = await Comment.create({
      postId,
      pseudonym,
      content,
      parentComment: parentComment || null,
    });

    await logActivity({
      type: "COMMENT",
      message: `User ${pseudonym} commented on post ${postId}`,
      userId: pseudonym,
      ip: req.headers.get("x-forwarded-for") || null,
    });

    return new Response(
      JSON.stringify({
        _id: comment._id.toString(),
        content: comment.content,
        pseudonym: comment.pseudonym,
        parentComment: comment.parentComment ? comment.parentComment.toString() : null,
        createdAt: comment.createdAt.toISOString(),
      }),
      { status: 201 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
