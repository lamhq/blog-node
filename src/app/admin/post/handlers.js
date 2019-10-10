const Post = require('../../models/post');
const { validationExc, notFoundExc } = require('../../../common/helpers');
const { validatePostData, getQueryData } = require('./helpers');

async function getPosts(req, res, next) {
  try {
    const query = getQueryData(req.query);
    const total = await Post.count(query.conditions);
    const items = await Post.find(query.conditions)
      .sort({ updatedAt: -1 })
      .skip(query.offset)
      .limit(query.limit);

    res
      .set('X-Pagination-Page-Count', Math.ceil(total / query.limit))
      .set('X-Pagination-Total', total)
      .json(items.map((item) => item.toResponse()));
  } catch (err) {
    next(err);
  }
}

async function addPost(req, res, next) {
  try {
    const data = req.body;
    const errors = validatePostData(data);
    if (errors) {
      throw validationExc('Invalid post data', errors);
    }

    const post = new Post();
    post.title = data.title;
    post.content = data.content;
    await post.save();
    res.json(post.toResponse());
  } catch (err) {
    next(err);
  }
}

async function getPost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw notFoundExc('No data found');
    }
    res.json(post.toResponse());
  } catch (err) {
    next(err);
  }
}

async function updatePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw notFoundExc('No data found');
    }

    const data = req.body;
    const errors = validatePostData(data);
    if (errors) {
      throw validationExc('Invalid post data', errors);
    }

    post.title = data.title;
    post.content = data.content;
    post.updatedAt = new Date();
    await post.save();
    res.json(post.toResponse());
  } catch (err) {
    next(err);
  }
}

async function deletePost(req, res, next) {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.json(true);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPosts,
  addPost,
  getPost,
  updatePost,
  deletePost,
};
