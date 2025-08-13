// app/api/posts/[id]/like/route.js
import { dbConnect } from "@/lib/dbConnect";
import Post from "@/models/Post";
import Notification from "@/models/Notification";

export async function PATCH(req, { params }) {
  await dbConnect();
  const { id } = params;

  let userId;
  try {
    const body = await req.json();
    userId = body.userId;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON format" }), { status: 400 });
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 });
  }

  try {
    const post = await Post.findById(id);
    if (!post) return new Response(JSON.stringify({ error: "Post not found" }), { status: 404 });

    const hasLiked = post.likedBy.includes(userId);

    if (hasLiked) {
      post.likes = Math.max(0, post.likes - 1);
      post.likedBy = post.likedBy.filter((uid) => uid !== userId);
    } else {
      post.likes += 1;
      post.likedBy.push(userId);
    }

    post.likedBy = Array.from(new Set(post.likedBy));
    await post.save();

    // 🔔 Create or update notification for the post owner
    if (!hasLiked && userId !== post.userId) {
      await Notification.findOneAndUpdate(
        { postId: post._id, userId: post.userId },
        {
          postId: post._id,
          userId: post.userId,
          type: "LIKE",
          totalLikes: post.likes,
        },
        { upsert: true, new: true }
      );
    }

    return new Response(JSON.stringify({ likes: post.likes, liked: !hasLiked }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
