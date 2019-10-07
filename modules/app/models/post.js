const mongoose = require('mongoose');

const { Schema } = mongoose;

// define schema
const postSchema = Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

// map schema to collection named `blog.posts`
const Post = mongoose.model('blog.posts', postSchema);

module.exports = Post;
