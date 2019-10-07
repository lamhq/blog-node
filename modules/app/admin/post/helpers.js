const validate = require('validate.js');

function validatePost(data) {
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

function getQueryData({ q, limit = 4, page = 1 }) {
  const limit2 = parseInt(limit, 10);
  const page2 = parseInt(page, 10);
  const conditions = {};

  // apply text search
  if (q) {
    conditions.title = new RegExp(q, 'i');
    conditions.content = new RegExp(q, 'i');
  }

  // calculate offset
  const offset = (page2 - 1) * limit2;
  return {
    conditions,
    limit: limit2,
    page,
    offset,
  };
}

module.exports = {
  validatePost,
  getQueryData,
};
