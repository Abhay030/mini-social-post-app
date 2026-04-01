const Post = require("../models/Post");

// @desc    Create a new post
// @route   POST /api/posts
const createPost = async (req, res) => {
  const { text, image } = req.body;
  if (!text && !image) return res.status(400).json({ message: "Text or Image is required" });

  try {
    const newPost = new Post({
      author: req.user.username,
      text: text || "",
      image: image || "",
    });

    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @desc    Get all posts (paginated)
// @route   GET /api/posts
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Post.countDocuments();
    const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: total > skip + posts.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @desc    Toggle like on a post
// @route   POST /api/posts/:id/like
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const usernameStr = String(req.user.username);
    const hasLikedIndex = post.likes.indexOf(usernameStr);

    if (hasLikedIndex !== -1) {
      post.likes.splice(hasLikedIndex, 1);
    } else {
      post.likes.push(usernameStr);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @desc    Add comment to a post
// @route   POST /api/posts/:id/comment
const addComment = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Comment text is required" });

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = {
      username: req.user.username,
      text,
    };

    post.comments.push(newComment);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = { createPost, getPosts, toggleLike, addComment };
