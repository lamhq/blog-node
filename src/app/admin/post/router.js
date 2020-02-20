const express = require('express');
const { verifyUserToken } = require('../account/middlewares');
const {
  getPosts,
  addPost,
  getPost,
  updatePost,
  deletePost,
} = require('./middlewares');

const router = express.Router();

router.route('/admin/posts')
  .get([verifyUserToken, getPosts])
  .post([verifyUserToken, addPost]);

router.route('/admin/posts/:id')
  .get([verifyUserToken, getPost])
  .put([verifyUserToken, updatePost])
  .delete([verifyUserToken, deletePost]);

module.exports = router;
