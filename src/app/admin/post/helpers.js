const validate = require('validate.js');

function validatePostData(data) {
  const rules = {
    title: {
      presence: { message: '^Email can\'t be blank', allowEmpty: false },
    },
    content: {
      presence: { allowEmpty: false },
    },
  };

  return validate(data, rules);
}

/**
 * Convert http query string to mongodb query object
 */
function getQueryData({ q, limit = 10, offset = 0 }) {
  const limit2 = parseInt(limit, 10);
  const offset2 = parseInt(offset, 10);
  const conditions = {};

  // apply text search
  if (q) {
    conditions.title = new RegExp(q, 'i');
    conditions.content = new RegExp(q, 'i');
  }

  return {
    conditions,
    limit: limit2,
    offset: offset2,
  };
}

module.exports = {
  validatePostData,
  getQueryData,
};
