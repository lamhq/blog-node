const express = require('express');
const middlewares = require('./middlewares');

const router = express.Router();

// refresh token
router.post('/tokens', [
  middlewares.verifyUserToken,
  middlewares.refreshToken,
]);

module.exports = router;
