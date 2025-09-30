import Post from "../models/postModel.js";
import userModel from "../models/userModel.js";

  export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    const post = await Post.create({ user: userId, content });
    await post.populate("user", "name email _id"); 


    req.io.emit("newPost", post); 

    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
  };

  export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("user", "name email _id")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
  };

  export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    post.content = content;
    await post.save();

    req.io.emit("updatePost", post);

    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
  };

  export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await post.deleteOne();

    req.io.emit("deletePost", { id });

    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
