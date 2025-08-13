"use client";
import { Menu } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import LikeButton from "./LikeButton";
import { useState } from "react";

export default function PostContent({
  post,
  isEditing,
  setIsEditing,
  newContent,
  setNewContent,
}) {
  const anonUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("anon_user"))
      : null;

  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(
    post.likedBy?.includes(anonUser?.id) || false
  );

  async function handleEditPost() {
    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      });

      if (!res.ok) throw new Error("Failed to update post");

      const updated = await res.json();
      setNewContent(updated.content);
      setIsEditing(false);
    } catch (err) {
      console.error("Error editing post:", err.message);
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <textarea
          className="w-full border border-gray-300 p-3 rounded-lg mb-3 focus:ring-2 focus:ring-yellow-500 outline-none"
          rows={4}
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={handleEditPost}
            className="bg-yellow-600 hover:bg-yellow-700 transition text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setNewContent(post.content);
            }}
            className="bg-gray-400 hover:bg-gray-500 transition text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md relative">
      <div className="flex justify-between items-start">
        <p className="text-gray-800 whitespace-pre-wrap">{newContent}</p>
        {anonUser?.pseudonym === post.pseudonym && (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="p-1 rounded-full hover:bg-gray-100">
              <EllipsisHorizontalIcon className="h-6 w-6 text-gray-500" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                    >
                      Edit
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        )}
      </div>

      <p className="mt-2 text-sm text-gray-500">
        — <span className="font-semibold">{post.pseudonym}</span>
      </p>

      {/* Like button directly under pseudonym */}
      <LikeButton
        postId={post._id}
        likes={likes}
        setLikes={setLikes}
        liked={liked}
        setLiked={setLiked}
      />
    </div>
  );
}
