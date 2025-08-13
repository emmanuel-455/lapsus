"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [anonUser, setAnonUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("anon_user"));
    if (!user) {
      router.push("/login"); // redirect if not logged in
    } else {
      setAnonUser(user);
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Post content cannot be empty!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          pseudonym: anonUser?.pseudonym || "Anonymous",
          userId: anonUser?.id,
          category,
          tags: tags.split(",").map(tag => tag.trim()).filter(Boolean)
        }),
      });

      if (!res.ok) throw new Error("Failed to create post");

      setContent("");
      setCategory("");
      setTags("");
      router.push("/"); // go back to home
    } catch (err) {
      console.error(err);
      alert("Error creating post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Create a New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            What's on your mind?
          </label>
          <textarea
            rows="5"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post here..."
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Category (optional)
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Life, Tech, Advice"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Tags (optional, comma separated)
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. motivation, coding, humor"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-4 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
