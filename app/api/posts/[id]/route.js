import { dbConnect } from "@/lib/dbConnect";
import Post from "@/models/Post";

export async function PATCH(req, { params }) {
  console.log("PATCH post route hit");
  await dbConnect();
  const { id } = params;

  try {
    const body = await req.json();
    const { userId, content } = body; // now supports both

    const post = await Post.findById(id);
    if (!post) {
      return new Response(JSON.stringify({ error: "Post not found" }), { status: 404 });
    }

    // ✅ If `content` exists → edit the post
    if (typeof content === "string") {
      post.content = content;
      await post.save({ validateBeforeSave: false });
      return new Response(JSON.stringify(post), { status: 200 });
    }

    // ✅ If `userId` exists → toggle like
    if (userId) {
      const alreadyLiked = post.likedBy?.includes(userId);

      if (alreadyLiked) {
        post.likedBy = post.likedBy.filter((u) => u !== userId);
        post.likes = Math.max(0, (post.likes || 0) - 1);
      } else {
        post.likedBy = [...(post.likedBy || []), userId];
        post.likes = (post.likes || 0) + 1;
      }

      await post.save({ validateBeforeSave: false });

      return new Response(
        JSON.stringify({
          likes: post.likes,
          liked: !alreadyLiked,
        }),
        { status: 200 }
      );
    }

    // If neither provided
    return new Response(
      JSON.stringify({ error: "No valid update data provided" }),
      { status: 400 }
    );

  } catch (err) {
    console.error("Post PATCH API Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
