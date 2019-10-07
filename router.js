const express = require('express');

const router = express.Router();
const app = require('./src/app/router');
const common = require('./src/common/router');
const adminAccount = require('./src/app/admin/account/router');
const adminPost = require('./src/app/admin/post/router');

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
