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
  sendMailRegistrationToUser,
  sendMailRegistrationToAdmin,
} = require('./helpers');

async function login(req, res, next) {
  try {
    var data = req.body
    var errors = validateLoginData(data)
    if (errors) {
      return next(validationExc('Please correct your input.', errors))
    }

    var user = await User.findOne({ email: data.loginId })
    if (!user || !user.checkPassword(data.password)) {
      return res.status(400).json(validationExc('Invalid login information.',
        { password: ['Incorrect username or password'] }))
    }

    res.json({
      token: user.createToken(data.remember ? '30 days' : '3h'),
      username: user.username,
      id: user._id
    })
  } catch (err) {
    next(err)
  }
}

async function getProfile(req, res, next) {
  try {
    var user = await User.findById(req.user._id)
    if (user) {
      return res.json({ email: user.email, username: user.username })
    } else {
      next(notFoundExc('No profile data found'))
    }
  } catch (err) {
    next(err)
  }
}

async function updateProfile(req, res, next) {
  try {
    var user = await User.findById(req.user._id)
    var data = req.body
    if (user) {
      let errors = validateProfileData(data, user)
      if (errors) {
        next(validationExc('Please check your form input', errors))
      } else {
        user.email = data.email
        user.username = data.username
        if (data.password)
          user.setPassword(data.password)
        var saved = await user.save()
        res.json({ username: saved.username, email: saved.email })
      }
    } else {
      next(notFoundExc('No profile data found'))
    }
  } catch (err) {
    next(err)
  }
}

const verifyUserToken = createMiddleware('jwtAdmin', jwtPayload => User.findById(jwtPayload.userId))

async function requestResetPassword(req, res, next) {
  try {
    var data = req.body
    var errors = await validateForgotPwdData(data)
    console.log(errors)
    if (errors) {
      return next(validationExc('Please correct your input.', errors))
    }

    var user = await User.findOne({
      email: data.email,
    })
    res.json({ message: 'Please check your email.' })
    sendMailRequestResetPwd(user)
  } catch (err) {
    next(err)
  }
}

async function resetPassword(req, res, next) {
  try {
    var data = req.body
    var errors = await validateResetPwdData(data)
    console.log(errors)
    if (errors) {
      return next(validationExc('Please correct your input.', errors))
    }

    var decoded = verifyToken(data.token)
    var user = await User.findOne({
      _id: decoded.userId,
      status: User.STATUS_ACTIVE
    })
    user.setPassword(data.password)
    await user.save()

    res.json({ message: 'Password updated successfully.' })
  } catch (err) {
    next(err)
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
