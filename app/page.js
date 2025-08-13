'use client';

import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/lib/getPosts"; // if this is server-only, switch to fetch('/api/posts')

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [canInteract, setCanInteract] = useState(false);

  useEffect(() => {
    // detect login
    const user = JSON.parse(localStorage.getItem("anon_user"));
    setCanInteract(!!user?.pseudonym);

    // load posts for everyone
    getPosts().then(setPosts).catch(console.error);
  }, []);

  return (
    <div>
      {!canInteract && (
        <p className="text-center text-gray-500 mt-4">
          You can read posts, but you must sign in to like or comment.
        </p>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} canInteract={canInteract} />
          ))
        )}
      </div>
    </div>
  );
}
