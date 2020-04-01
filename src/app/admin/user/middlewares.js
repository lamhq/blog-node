const User = require('../../models/user');
const { formSubmissionError, notFoundError } = require('../../../common/utils');
const { validateUserData, getQueryData } = require('./utils');

async function findUsers(req, res, next) {
  try {
    const query = getQueryData(req.query);
    const total = await User.count(query.conditions);
    const items = await User.find(query.conditions)
      .sort(query.sort)
      .skip(query.offset)
      .limit(query.limit);
    const resp = {
      meta: {
        total,
        totalPages: Math.ceil(total / query.limit),
      },
      data: items.map((item) => item.toResponse()),
    };
    res.json(resp);
  } catch (err) {
    next(err);
  }
}

async function addUser(req, res, next) {
  try {
    const data = req.body;
    const errors = await validateUserData(data);
    if (errors) {
      throw formSubmissionError(errors);
    }
    const user = new User({
      email: data.email,
      displayName: data.displayName,
      status: User.STATUS_ACTIVE,
    });
    user.setPassword(data.password);
    await user.save();
    res.json(user.toResponse());
  } catch (err) {
    next(err);
  }
}

async function getUserDetail(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw notFoundError('No data found');
    }
    res.json(user.toResponse());
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw notFoundError('No data found');
    }

    const data = req.body;
    const errors = validateUserData(data);
    if (errors) {
      throw formSubmissionError(errors);
    }

    user.title = data.title;
    user.content = data.content;
    user.updatedAt = new Date();
    await user.save();
    res.json(user.toResponse());
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.json(true);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  findUsers,
  addUser,
  getUserDetail,
  updateUser,
  deleteUser,
};
