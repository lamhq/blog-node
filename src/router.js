const express = require('express');

const router = express.Router();
const app = require('./app/router');
const common = require('./common/router');
const adminAccount = require('./app/admin/account/router');
const adminPost = require('./app/admin/post/router');

router.get('/', (req, res) => {
  res.json('api server is working.');
});

router.use('/api/v1', [
  common,
  app,

  // admin
  adminAccount,
  adminPost,
]);

module.exports = router;
