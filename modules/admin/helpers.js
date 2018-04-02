const validate = require('validate.js');
const querystring = require('querystring');
const path = require('path');
const User = require('../common/models/user');
const config = require('../../config');
const { sendMail } = require('../common/mail');
const { verifyToken } = require('../common/helpers')

function validateLoginForm(data) {
  var rules = {
    loginId: {
      presence: { message: '^Username can\'t be blank' },
    },
    password: {
      presence: true,
    },
  }
  return validate(data, rules, { format: 'grouped' })
}

/**
 * validate and filter input from profile form
 * @param  object form input
 * @param  User mongoose user model
 * @return object list of validation errors or null
 */
function validateProfileData(data, user) {
  // function that perform password validation
  validate.validators.checkPassword = function (value, options, key, attributes) {
    if (value && !user.checkPassword(value))
      return 'is wrong'
    return null
  }

  // validation rules
  var rules = {
    username: {
      presence: true,
      length: { minimum: 3, maximum: 30 },
      format: {
        pattern: '[a-z0-9]+',
        flags: 'i',
        message: 'can only contain alphabet and numeric characters'
      }
    },
    email: {
      presence: true,
      email: true,
    },
    password: function (value, attributes, attributeName, options, constraints) {
      // only validate when value is not empty
      return value ? {
        length: { minimum: 6, maximum: 30 },
      } : false
    },
    currentPassword: function (value, attributes, attributeName, options, constraints) {
      // only validate when password is not empty
      return attributes.password ? {
        presence: true,
        checkPassword: true
      } : false
    }
  }

  return validate(data, rules)
}

async function checkEmailExist(value) {
  var user = await User.findOne({
    email: value,
  })
  return user
    ? Promise.resolve()
    : Promise.resolve('does not exist or account is not enabled')
}

// validate required fields on forgot password form
async function validateForgotPwdForm(data) {
  validate.Promise = global.Promise;
  validate.validators.emailExists = checkEmailExist;
  const rules = {
    email: {
      presence: { allowEmpty: false },
      email: true,
      emailExists: true,
    },
  };

  let errors;
  try {
    await validate.async(data, rules, { format: 'grouped' });
  } catch (err) {
    errors = err;
  }

  return errors;
}

// validate.js custom async validate function to validate user is valid or not
async function validateUserToken(value) {
  var decoded = verifyToken(value)
  if (!decoded) return Promise.resolve('invalid')

  var user = await User.findOne({
    _id: decoded.userId,
    userType: User.TYPE_ADMIN,
    status: User.STATUS_ACTIVE
  })
  return user
    ? Promise.resolve()
    : Promise.resolve('is legal but the account does not exist.')
}

// validate form to update new password
async function validateResetPwdForm(data) {
  validate.Promise = global.Promise
  validate.validators.userToken = validateUserToken
  var rules = {
    token: {
      presence: { allowEmpty: false },
      userToken: true
    },
    password: {
      presence: { allowEmpty: false },
      length: { minimum: 6, maximum: 30 }
    },
    verify: {
      presence: { allowEmpty: false },
      equality: 'password'
    }
  }

  var errors
  try {
    await validate.async(data, rules, { format: 'grouped' })
  } catch (err) {
    errors = err
  }
  return errors
}

// send email to check containe link to reset password
function sendMailRequestResetPwd(user) {
  const q = querystring.stringify({
    token: user.createToken('10m').value,
  });
  const link = `${config.webUrl}/admin/forgot-password?${q}`;
  const message = {
    from: `${config.appName} <${config.mail.autoEmail}>`,
    to: `${user.email} <${user.email}>`,
    subject: 'Password reset request',
    templatePath: path.resolve(__dirname, 'email/reset-password.html'),
    params: {
      name: user.email,
      link,
    },
  };

  return sendMail(message);
}

module.exports = {
  validateLoginForm,
  validateProfileData,
  validateForgotPwdForm,
  sendMailRequestResetPwd,
  validateResetPwdForm,
};
