const validate = require('validate.js');
const { checkEmailNotExist } = require('../../utils');

async function validateUserData(data, user = null) {
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
      emailNotExists: {
        user,
      },
    },
    password: {
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

/**
 * Convert http query string to mongodb query object
 */
function getQueryData({
  search,
  limit = 10,
  offset = 0,
  sort = 'createdAt',
  dir = 'desc',
}) {
  const limit2 = parseInt(limit, 10);
  const offset2 = parseInt(offset, 10);
  const conditions = {};

  // apply text search
  if (search) {
    conditions.displayName = new RegExp(search, 'i');
    conditions.email = new RegExp(search, 'i');
  }

  return {
    conditions,
    limit: limit2,
    offset: offset2,
    sort: {
      [sort]: dir === 'desc' ? -1 : 1,
    },
  };
}

module.exports = {
  validateUserData,
  getQueryData,
};
