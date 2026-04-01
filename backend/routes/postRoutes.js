const express = require("express");
const router = express.Router();
const { createPost, getPosts, toggleLike, addComment } = require("../controllers/postController");
const auth = require("../middleware/authMiddleware");

router.route("/")
  .get(getPosts)
  .post(auth, createPost);

router.post("/:id/like", auth, toggleLike);
router.post("/:id/comment", auth, addComment);

module.exports = router;
