const handlers = require('./handlers');
const express = require('express');

const router = express.Router();

// user login
router.post('/account/sessions', handlers.login);

// user register
router.post('/account/registrations', handlers.register);

// send reset password link to email
router.post('/account/password-reset/requests', handlers.requestResetPassword);

// update account's password
router.put('/account/password', handlers.resetPassword);

// all routers after this middleware require an access token
router.use(/^\/account.*?/, handlers.verifyUserToken);

router.route('/account/profile')
  // get account's data
  .get(handlers.getProfile)
  // update account's data
  .put(handlers.updateProfile);

module.exports = router;
