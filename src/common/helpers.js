const jwt = require('jsonwebtoken');
const ms = require('ms');
const mongoose = require('mongoose');
const validate = require('validate.js');
const moment = require('moment');
const querystring = require('querystring');

const logger = require('./log');
const config = require('../../config');

/**
 * Return api error data for internal server error
 *
 * @param {String} message
 * @param {Object} options
 */
function serverExc(message, options = {}) {
  return {
    status: 500,
    code: 'server_error',
    message,
    ...options,
  };
}

/**
 * Return api error data for 404 error
 *
 * @param {String} message
 * @param {Object} options
 */
function notFoundExc(message, options = {}) {
  return {
    status: 404,
    code: 'resource_not_found',
    message,
    ...options,
  };
}

/**
 * Return api error data for form submission error
 *
 * @param {String} message
 * @param {Object} errors object contain field errors
 */
function validationExc(message, errors, code = null) {
  return {
    status: 400,
    code: code || 'invalid_data',
    message,
    errors,
  };
}

/**
 * Return api error data for unauthenticated error
 *
 * @param {String} message
 */
function unauthorizedExc(message) {
  return {
    status: 401,
    code: 'unauthorized',
    message,
  };
}

/**
 * @returns Promise
 */
function connectToDb() {
  mongoose.set('debug', config.db.debug);
  mongoose.Promise = global.Promise;
  const options = {
    config: { autoIndex: false },
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  return mongoose.connect(config.db.uri, options);
}

/**
 * Create an access token for user
 * @param {Object} user
 * @param {String} duration
 */
function createToken(id, duration) {
  const expireAt = new Date();
  expireAt.setSeconds(expireAt.getSeconds() + (ms(duration) / 1000));
  const value = jwt.sign({ value: id }, config.appSecret, { expiresIn: duration });
  return {
    value,
    expireAt,
  };
}

function decryptToken(token) {
  let result = false;
  try {
    result = jwt.verify(token, config.appSecret);
  } catch (err) {
    logger.info('Validate access token failed.');
  }
  return result;
}

/**
 * Get value of nested property by path
 *
 * @param {Mixed} obj
 * @param {String} path
 * @param {Mixed} defVal default value when the result is undefined
 */
function getObjectValue(obj, path, defVal = undefined) {
  const result = validate.getDeepObjectValue(obj, path);
  return result || defVal;
}

function filterObjectKeys(obj, allowedKeys = []) {
  const result = {};
  allowedKeys.forEach((key) => {
    if (obj[key]) {
      result[key] = obj[key];
    }
  });
  return result;
}

function createWebUrl(path, params = null) {
  const q = params ? `?${querystring.stringify(params)}` : '';
  return `${config.webUrl}/${path}${q}`;
}

/**
 * Return string with padding
 * @param {Number} n number
 * @param {Number} width
 * @param {String} z padding character
 */
function pad(n, width, z = '0') {
  const str = n.toString();
  return str.length >= width ? str : new Array((width - str.length) + 1).join(z) + str;
}

function randomCode(min, max) {
  const n = Math.floor((Math.random() * ((max - min) + 1)) + min);
  return pad(n, 4);
}

function randomString(length = 5) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function round(number, precision) {
  return parseFloat(number).toFixed(precision);
}

function getDatePart(date) {
  return date.toISOString().substr(0, 10);
}

function buildQuery(obj) {
  return Object.keys(obj).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
}

/**
 * Get duration between two dates in miliseconds
 * Return negative value if d1 is less than d2
 *
 * @param {String} date1
 * @param {String} date2
 */
function getTimeDiff(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1 - d2;
}

function timeout(milis) {
  return new Promise((resolve) => {
    setTimeout(resolve, milis);
  });
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function generateRandomPassword(len = 8) {
  return Math.random().toString(36).slice(-len);
}

/**
 * Format javascript date to human readable string
 * @param {String} value
 */
function formatDate(value) {
  return value ? moment(value).format('DD/MM/YYYY') : '';
}

/**
 * Format javascript date to human readable string
 * @param {String} value
 */
function formatDateTime(value) {
  return value ? moment(value).format('DD/MM/YYYY h:mm a') : '';
}

module.exports = {
  connectToDb,
  createToken,
  decryptToken,
  getObjectValue,
  filterObjectKeys,
  createWebUrl,
  round,
  buildQuery,
  escapeRegExp,
  notFoundExc,
  validationExc,
  serverExc,
  unauthorizedExc,
  randomCode,
  getDatePart,
  getTimeDiff,
  timeout,
  pad,
  generateRandomPassword,
  formatDate,
  formatDateTime,
  randomString,
};
