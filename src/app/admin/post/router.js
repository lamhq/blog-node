const express = require('express');
const { verifyUserToken } = require('../account/handlers');
const {
  getPosts,
  addPost,
  getPost,
  updatePost,
  deletePost,
} = require('./handlers');

const router = express.Router();

router.route('/posts')
  .get([verifyUserToken, getPosts])
  .post([verifyUserToken, addPost]);

router.route('/posts/:id')
  .get([verifyUserToken, getPost])
  .put([verifyUserToken, updatePost])
  .delete([verifyUserToken, deletePost]);

module.exports = router;
