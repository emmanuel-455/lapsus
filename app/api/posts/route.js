// app/api/posts/route.js

import { dbConnect } from "@/lib/dbConnect";
import Post from "@/models/Post";

// GET: Fetch posts with optional query filters
export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 5;
  const sortBy = searchParams.get("sort") || "new";
  const pseudonym = searchParams.get("pseudonym");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const skip = (page - 1) * limit;

  let sortOption = {};
  if (sortBy === "old") sortOption = { createdAt: 1 };
  else if (sortBy === "likes") sortOption = { likes: -1 };
  else sortOption = { createdAt: -1 };

  let query = {};
  if (pseudonym) query.pseudonym = pseudonym;
  if (category) query.category = category;
  if (search) query.content = { $regex: search, $options: "i" };

  try {
    const posts = await Post.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments(query);

    const formatted = posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
    }));

    return new Response(
      JSON.stringify({
        posts: formatted,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// POST: Create a new post
export async function POST(req) {
  await dbConnect();

  try {
    const { content, pseudonym, category, tags } = await req.json();

    if (!content || content.trim().length < 3) {
      return new Response(
        JSON.stringify({ error: "Post content too short" }),
        { status: 400 }
      );
    }

    const post = await Post.create({
      content,
      pseudonym,
      category: category || null,
      tags: tags || [],
    });

    return new Response(
      JSON.stringify({
        _id: post._id.toString(),
        content: post.content,
        pseudonym: post.pseudonym,
        category: post.category,
        tags: post.tags,
      }),
      { status: 201 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
