const User = require('./models/user');
const config = require('../../config');
const createMiddleware = require('../common/jwt');

const verifyUserToken = createMiddleware(
  'jwtUser',
  (jwtPayload) => User.findById(jwtPayload.userId),
);

// return a new token using a valid user token
// this is used to prolong token expiration
async function refreshToken(req, res, next) {
  try {
    const { user } = req;
    res.json({
      id: user._id,
      token: user.createToken(config.accessTokenLifeTime),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  verifyUserToken,
  refreshToken,
};
