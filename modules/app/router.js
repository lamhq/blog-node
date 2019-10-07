const express = require('express');
const handlers = require('./handlers');

const router = express.Router();

// refresh token
router.post('/tokens', [
  handlers.verifyUserToken,
  handlers.refreshToken,
]);

module.exports = router;
