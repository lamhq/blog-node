const createMiddleware = require('../../../common/jwt');
const User = require('../../models/user');
const {
  validationExc,
  notFoundExc,
  verifyToken,
} = require('../../../common/helpers');
const {
  validateLoginData,
  validateRegistrationData,
  validateProfileData,
  validateForgotPwdData,
  validateResetPwdData,
  sendMailRequestResetPwd,
} = require('./helpers');

async function login(req, res, next) {
  try {
    const data = req.body;
    const errors = validateLoginData(data);
    if (errors) {
      throw validationExc('Please correct your input.', errors);
    }

    const user = await User.findOne({ email: data.loginId });
    if (!user || !user.isPasswordValid(data.password)) {
      throw validationExc('Invalid login information.',
        { password: ['Incorrect username or password'] });
    }

    res.json({
      token: user.createToken(data.remember ? '30 days' : '3h'),
      user,
    });
  } catch (err) {
    next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw notFoundExc('No profile data found');
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    const data = req.body;
    if (user) {
      const errors = validateProfileData(data, user);
      if (errors) {
        next(validationExc('Please check your form input', errors));
      } else {
        user.email = data.email;
        user.username = data.username;
        if (data.password) { user.setPassword(data.password); }
        const saved = await user.save();
        res.json({ username: saved.username, email: saved.email });
      }
    } else {
      next(notFoundExc('No profile data found'));
    }
  } catch (err) {
    next(err);
  }
}

const verifyUserToken = createMiddleware('jwtAdmin', (jwtPayload) => User.findById(jwtPayload.value));

async function requestResetPassword(req, res, next) {
  try {
    const data = req.body;
    const errors = await validateForgotPwdData(data);
    console.log(errors);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    const user = await User.findOne({
      email: data.email,
    });
    res.json({ message: 'Please check your email.' });
    sendMailRequestResetPwd(user);
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const data = req.body;
    const errors = await validateResetPwdData(data);
    console.log(errors);
    if (errors) {
      return next(validationExc('Please correct your input.', errors));
    }

    const decoded = verifyToken(data.token);
    const user = await User.findOne({
      id: decoded.userId,
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
      return next(validationExc('Please correct your input.', errors));
    }

    const user = new User({
      ...data,
      status: User.STATUS_ACTIVE,
    });
    await user.save();
    // sendMailRegistrationToUser(user);
    // sendMailRegistrationToAdmin(user);

    const { __v, password, ...safeData } = user.toObject();
    return res.json(safeData);
  } catch (err) {
    return next(err);
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
