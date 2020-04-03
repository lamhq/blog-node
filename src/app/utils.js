const User = require('./models/user');

// return error if there is already a user with that email exists
// if user is passed in `options`, exclude that user email
async function checkEmailNotExist(value, options) {
  let conditions = {
    email: value,
  };
  if (options.user) {
    conditions = {
      ...conditions,
      _id: { $ne: options.user._id },
    };
  }
  const user = await User.findOne(conditions);
  return user ? '^register/email-not-available' : undefined;
}

// return error if there is no user with that email exists
async function checkEmailExist(value) {
  const user = await User.findOne({
    email: value,
  });
  return user ? undefined : '^forgot-password/user-not-found';
}

module.exports = {
  checkEmailNotExist,
  checkEmailExist,
};
