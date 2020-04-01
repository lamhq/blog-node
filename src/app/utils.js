const User = require('./models/user');

async function checkEmailNotExists(value) {
  const user = await User.findOne({
    email: value,
  });
  return !user
    ? Promise.resolve()
    : Promise.resolve('^register/email-not-available');
}

module.exports = {
  checkEmailNotExists,
};
