const express = require('express');
const {
  login,
  register,
  requestResetPassword,
  resetPassword,
  verifyUserToken,
  getProfile, updateProfile,
} = require('./handlers');

const router = express.Router();

// user login
router.post('/login', login);

// user register
router.post('/register', register);

// send reset password link to email
router.post('/reset-password', requestResetPassword);

// update account's password
router.put('/account/password', resetPassword);

router.route('/account/profile')
  // get account's data
  .get([verifyUserToken, getProfile])
  // update account's data
  .put([verifyUserToken, updateProfile]);

module.exports = router;
