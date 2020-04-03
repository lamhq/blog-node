/* eslint-disable arrow-body-style */
const validate = require('validate.js');
const querystring = require('querystring');
const path = require('path');
const User = require('../../models/user');
const config = require('../../../config');
const { sendMail } = require('../../../common/mail');
const { decryptToken } = require('../../../common/utils');
const { checkEmailNotExist, checkEmailExist } = require('../../utils');

function validateLoginData(data) {
  const rules = {
    username: {
      presence: {
        allowEmpty: false,
        message: '^common/required-input',
      },
    },
    password: {
      presence: {
        allowEmpty: false,
        message: '^common/required-input',
      },
    },
  };
  return validate(data, rules, { format: 'grouped' });
}

/**
 * validate and filter input from profile form
 * @param  object form input
 * @param  User mongoose user model
 * @return object list of validation errors or null
 */
function validateProfileData(data, user) {
  // function that perform password validation
  validate.validators.checkPassword = (value) => {
    if (value && !user.isPasswordValid(value)) { return '^common/invalid-currentpr-password'; }
    return null;
  };

  // validation rules
  const rules = {
    displayName: {
      presence: true,
      length: { minimum: 3, maximum: 30 },
    },
    newPassword: (value) => {
      // only validate when value is not empty
      return value ? {
        length: { minimum: 6, maximum: 30 },
      } : false;
    },
    currentPassword: (value, attributes) => {
      // only validate when password is not empty
      return attributes.newPassword ? {
        presence: true,
        checkPassword: true,
      } : false;
    },
  };

  return validate(data, rules);
}

// validate required fields on forgot password form
async function validateForgotPwdData(data) {
  validate.Promise = global.Promise;
  validate.validators.emailExists = checkEmailExist;
  const rules = {
    email: {
      email: {
        message: '^common/invalid-email',
      },
      presence: {
        allowEmpty: false,
        message: '^common/required-field',
      },
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
  const decoded = decryptToken(value);
  if (!decoded) return Promise.resolve('invalid');

  const user = await User.findOne({
    _id: decoded.value,
    status: User.STATUS_ACTIVE,
  });
  return user
    ? Promise.resolve()
    : Promise.resolve('is legal but the account does not exist.');
}

// validate form to update new password
async function validateResetPwdData(data) {
  validate.Promise = global.Promise;
  validate.validators.userToken = validateUserToken;
  const rules = {
    token: {
      presence: { allowEmpty: false },
      userToken: true,
    },
    password: {
      presence: { allowEmpty: false },
      length: { minimum: 6, maximum: 30 },
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

// send email to check containe link to reset password
function sendMailRequestResetPwd(user) {
  const { appName, mail: { autoEmail } } = config;
  const q = querystring.stringify({
    token: user.createToken('1h').value,
  });
  const link = `${config.webUrl}/reset-password?${q}`;

  const message = {
    from: `${appName} <${autoEmail}>`,
    to: `${user.email} <${user.email}>`,
    subject: `${appName} - Password reset request`,
    templatePath: path.resolve(__dirname, 'email/reset-password.pug'),
    params: {
      appName: config.appName,
      link,
    },
  };

  return sendMail(message);
}

async function validateRegistrationData(data) {
  validate.Promise = global.Promise;
  validate.validators.emailNotExists = checkEmailNotExist;

  let errors;
  const constraints = {
    displayName: {
      presence: {
        allowEmpty: false,
        message: '^common/required-input',
      },
    },
    email: {
      presence: {
        allowEmpty: false,
        message: '^common/required-input',
      },
      email: {
        message: '^common/invalid-email',
      },
      emailNotExists: true,
    },
    password: {
      presence: {
        allowEmpty: false,
        message: '^common/required-input',
      },
      length: {
        minimum: 6,
        maximum: 30,
        tooLong: ['common/password-too-long', { max: 30 }],
        tooShort: ['common/password-too-short', { min: 6 }],
      },
    },
  };

  try {
    await validate.async(data, constraints, { format: 'grouped' });
  } catch (err) {
    errors = err;
  }
  return errors;
}

module.exports = {
  validateLoginData,
  validateProfileData,
  validateForgotPwdData,
  sendMailRequestResetPwd,
  validateResetPwdData,
  validateRegistrationData,
};
