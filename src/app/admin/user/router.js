const express = require('express');
const { verifyUserToken } = require('../account/middlewares');
const {
  findUsers,
  addUser,
  getUserDetail,
  updateUser,
  deleteUser,
} = require('./middlewares');

const router = express.Router();

router.route('/admin/users/:id')
  .get([verifyUserToken, getUserDetail])
  .put([verifyUserToken, updateUser])
  .delete([verifyUserToken, deleteUser]);

router.route('/admin/users')
  .get([verifyUserToken, findUsers])
  .post([verifyUserToken, addUser]);

module.exports = router;
