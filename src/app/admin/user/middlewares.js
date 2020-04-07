const User = require('../../models/user');
const {
  formSubmissionError,
  notFoundError,
  requestError,
  isValidObjectId,
} = require('../../../common/utils');
const { validateUserData, getQueryData } = require('./utils');

async function findUsers(req, res, next) {
  try {
    const query = getQueryData(req.query);
    const total = await User.estimatedDocumentCount(query.conditions);
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
      status: data.status,
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
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw requestError('Invalid user id');
    }
    const user = await User.findById(id);
    if (!user) {
      throw notFoundError('User not found');
    }
    res.json(user.toResponse());
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw requestError('Invalid user id');
    }

    const user = await User.findById(id);
    if (!user) {
      throw notFoundError('User not found');
    }

    const data = req.body;
    const errors = await validateUserData(data, user);
    if (errors) {
      throw formSubmissionError(errors);
    }

    user.set({
      email: data.email,
      displayName: data.displayName,
      status: data.status,
    });
    if (data.password) {
      user.setPassword(data.password);
    }
    await user.save();
    res.json(user.toResponse());
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw requestError('Invalid user id');
    }

    const data = await User.deleteOne({ _id: id });
    res.json(data.deletedCount === 1);
  } catch (err) {
    next(err);
  }
}

async function deleteUsers(req, res, next) {
  try {
    const { records, action } = req.body;
    const ids = records.map((userId) => {
      if (!isValidObjectId(userId)) {
        throw requestError(`Invalid user id: ${userId}`);
      }
      return userId;
    });

    if (action !== 'delete') {
      throw requestError(`Invalid action: ${action}`);
    }

    const data = await User.deleteMany({ _id: { $in: ids } });
    res.json(data.deletedCount === ids.length);
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
  deleteUsers,
};
