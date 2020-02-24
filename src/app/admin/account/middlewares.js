const createMiddleware = require('../../../common/jwt');
const User = require('../../models/user');
const {
  formSubmissionError,
  notFoundError,
  decryptToken,
  clientError,
} = require('../../../common/utils');
const {
  validateLoginData,
  validateRegistrationData,
  validateProfileData,
  validateForgotPwdData,
  validateResetPwdData,
  sendMailRequestResetPwd,
} = require('./utils');

// check user is admin
const verifyUserToken = createMiddleware('jwtAdmin',
  (jwtPayload) => User.findById(jwtPayload.value));

async function login(req, res, next) {
  try {
    const data = req.body;
    const errors = validateLoginData(data);
    if (errors) {
      throw formSubmissionError(errors);
    }

    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw clientError('There is no user with this email.', 'login/user_not_found');
    }

    if (!user.isPasswordValid(data.password)) {
      throw clientError('Invalid password.', 'login/invalid-password');
    }

    if (user.status !== User.STATUS_ACTIVE) {
      throw clientError('User is disabled.', 'login/user_is_disabled');
    }

    res.json({
      token: user.createToken(data.remember ? '30 days' : '3h'),
      user: user.toResponse(),
    });
  } catch (err) {
    next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw notFoundError('No profile data found');
    }
    res.json(user.toResponse());
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    const data = req.body;
    if (!user) {
      throw notFoundError('No profile data found');
    }
    const errors = validateProfileData(data, user);
    if (errors) {
      throw formSubmissionError(errors);
    }

    user.displayName = data.displayName;
    if (data.newPassword) {
      user.setPassword(data.newPassword);
    }
    await user.save();
    res.json(user.toResponse());
  } catch (err) {
    next(err);
  }
}

async function requestResetPassword(req, res, next) {
  try {
    const data = req.body;
    const errors = await validateForgotPwdData(data);
    if (errors) {
      throw formSubmissionError(errors);
    }

    const user = await User.findOne({
      email: data.email,
    });
    await sendMailRequestResetPwd(user);
    res.json({ message: 'Please check your email.' });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const data = req.body;
    const errors = await validateResetPwdData(data);
    if (errors) {
      throw formSubmissionError(errors);
    }

    const decoded = decryptToken(data.token);
    const user = await User.findOne({
      _id: decoded.value,
      status: User.STATUS_ACTIVE,
    });
    user.setPassword(data.password);
    await user.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    next(err);
  }
}

// user register
async function register(req, res, next) {
  try {
    const data = req.body;
    const errors = await validateRegistrationData(data);
    if (errors) {
      throw formSubmissionError(errors);
    }

    const user = new User({
      ...data,
      status: User.STATUS_ACTIVE,
    });
    await user.save();
    res.json(user.toResponse());
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  register,
  getProfile,
  updateProfile,
  verifyUserToken,
  requestResetPassword,
  resetPassword,
};
