const mongoose = require('mongoose');

const { Schema } = mongoose;

// define schema
const schema = Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });


class ModelClass {
  toResponse() {
    const {
      __v,
      _id,
      ...data
    } = this.toObject();
    return { id: this.id, ...data };
  }
}

schema.loadClass(ModelClass);

// map schema to collection named `posts`
const Post = mongoose.model('Post', schema);

module.exports = Post;
