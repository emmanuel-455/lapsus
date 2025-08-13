import { useState } from "react";
import { Menu } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { FaRegCommentDots } from "react-icons/fa";

export default function CommentList({
  comments,
  anonUser,
  editingCommentId,
  setEditingCommentId,
  editingContent,
  setEditingContent,
  postId,
  setComments,
  replyContent,
  setReplyContent,
  handleReplySubmit,
}) {
  const [activeReply, setActiveReply] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);

  const displayedComments = comments.slice(0, visibleCount);

  function handleViewMore() {
    setVisibleCount((prev) => prev + 3);
  }

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Comments</h4>
      {comments.length === 0 ? (
        <p className="text-sm text-gray-400">No comments yet.</p>
      ) : (
        <>
          {displayedComments.map((comment) => (
            <div key={comment._id} className="border-t py-2 relative">
              {editingCommentId === comment._id ? (
                <>
                  <input
                    type="text"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full border p-2 mb-1 rounded"
                  />
                  <button
                    onClick={() => handleEdit(comment._id)}
                    className="text-sm bg-yellow-600 text-white px-2 py-1 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditingContent("");
                    }}
                    className="text-sm bg-gray-400 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <p>{comment.content}</p>
                      <p className="text-xs text-gray-500">— {comment.pseudonym}</p>
                    </div>

                    {/* Three dot menu */}
                    {comment.pseudonym === anonUser?.pseudonym && (
                      <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button className="p-1 rounded-full hover:bg-gray-100">
                          <EllipsisHorizontalIcon className="h-5 w-5 text-gray-500" />
                        </Menu.Button>
                        <Menu.Items className="absolute right-0 mt-2 w-28 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none z-50">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => {
                                    setEditingCommentId(comment._id);
                                    setEditingContent(comment.content);
                                  }}
                                  className={`${
                                    active ? "bg-gray-100" : ""
                                  } w-full text-left px-3 py-1 text-sm text-gray-700`}
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

                  {/* Comment icon */}
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() =>
                        setActiveReply(activeReply === comment._id ? null : comment._id)
                      }
                      className="flex items-center text-gray-500 hover:text-green-600"
                    >
                      <FaRegCommentDots className="h-4 w-4" />
                      <span className="ml-1 text-xs">Reply</span>
                    </button>
                  </div>

                  {/* Reply form toggles */}
                  {activeReply === comment._id && (
                    <div className="mt-2 ml-4 animate-fadeIn">
                      <input
                        type="text"
                        value={(replyContent && replyContent[comment._id]) || ""}
                        onChange={(e) =>
                          setReplyContent((prev) => ({
                            ...prev,
                            [comment._id]: e.target.value,
                          }))
                        }
                        placeholder="Write a reply..."
                        className="w-full border p-2 rounded mb-1 text-sm"
                      />
                      <button
                        onClick={() => handleReplySubmit(comment._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Send
                      </button>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies?.length > 0 && (
                    <div className="ml-4 mt-2 border-l pl-2">
                      {comment.replies.map((reply) => (
                        <div key={reply._id} className="mb-2">
                          <p className="text-sm">{reply.content}</p>
                          <p className="text-xs text-gray-500">— {reply.pseudonym}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {/* View More Button */}
          {visibleCount < comments.length && (
            <div className="mt-2">
              <button
                onClick={handleViewMore}
                className="text-sm text-blue-500 hover:underline"
              >
                View more comments
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
