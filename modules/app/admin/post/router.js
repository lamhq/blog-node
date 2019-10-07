const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

router.route('/posts')
  .get(handlers.getPosts)
  .post(handlers.addPost);

router.route('/posts/:id')
  .get(handlers.getPost)
  .put(handlers.updatePost)
  .delete(handlers.deletePost);

module.exports = router;
