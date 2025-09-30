import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  addPost,
  editPost,
  removePost,
} from "../state/socialSlice";
import { io } from "socket.io-client";

//  Separate PostItem component
function PostItem({ post, user, dispatch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const handleSave = () => {
    if (!editContent.trim()) return;
    dispatch(updatePost({ id: post._id, content: editContent }));
    setIsEditing(false);
  };

  return (
    <li className="border rounded p-4">
      <div className="flex justify-between items-center">
        <span className="font-semibold">{post.user?.name || "Unknown"}</span>

        {String(post.user?._id || post.user) === String(user?._id) && (
          <div>
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mr-2 text-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => dispatch(deletePost(post._id))}
                  className="text-red-500"
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <button onClick={handleSave} className="mr-2 text-green-500">
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(post.content);
                  }}
                  className="text-gray-500"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {!isEditing ? (
        <p className="mt-2">{post.content}</p>
      ) : (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full border rounded p-2 mt-2"
        />
      )}
    </li>
  );
}

export function Social() {
  const dispatch = useDispatch();
  const { posts, status } = useSelector((s) => s.social);
  const { user } = useSelector((s) => s.auth);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_BASE);

    socket.on("newPost", (post) => {
      dispatch(addPost(post));
    });

    socket.on("updatePost", (post) => {
      dispatch(editPost(post));
    });

    socket.on("deletePost", ({ id }) => {
      dispatch(removePost(id));
    });

    return () => socket.disconnect();
  }, [dispatch]);

  useEffect(() => {
    if (status === "idle") dispatch(fetchPosts());
  }, [status, dispatch]);

  const handleCreate = () => {
    if (!newPost.trim()) return;
    dispatch(createPost({ content: newPost }));
    setNewPost("");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Social Feed</h1>

      <div className="mb-4">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your trading idea..."
          className="w-full border rounded p-2"
        />
        <button
          onClick={handleCreate}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Post
        </button>
      </div>

      {status === "loading" && <p>Loading posts...</p>}
      {status === "failed" && <p>Error loading posts.</p>}

      <ul className="space-y-4">
        {[...new Map(posts.map((p) => [p._id, p])).values()].map((post) => (
          <PostItem key={post._id} post={post} user={user} dispatch={dispatch} />
        ))}
      </ul>
    </div>
  );
}
