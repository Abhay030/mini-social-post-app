const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
}, { timestamps: true });

const PostSchema = new mongoose.Schema({
  author: { type: String, required: true },
  text: { type: String, default: "" },
  image: { type: String, default: "" }, // Base64 string for image
  likes: [{ type: String }], // Array of usernames
  comments: [CommentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
