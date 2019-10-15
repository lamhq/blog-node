const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('./src/common/log');
const sentry = require('./src/common/sentry');
const { notFoundError } = require('./src/common/helpers');
const router = require('./router');

const app = express();

// integrate sentry with raven-node
sentry.install();
sentry.addRequestHandler(app);

// enable parsing request boby with different content types
app.use(bodyParser.json());

// log http request to console
app.use(morgan('tiny', {
  stream: logger.stream,
}));

// application router
app.use(router);

// catch 404 and forward to error handler
app.use((req, res, next) => next(notFoundError('No route found')));

sentry.addErrorHandler(app);

// error handler
app.use((err, req, res, next) => {
  let resp = [];
  // multiple errors thrown in app
  if (Array.isArray(err)) {
    resp = err;
  } else {
    let error = {};
    // single error thrown in app
    if (err.status) {
      error = err;
    } else {
      // uncaught exception
      logger.error(err);
      error = {
        status: 500,
        code: 'server-error',
        title: 'Unknown error occured',
      };
    }
    resp.push(error);
  }

  // return an array of errors
  res.status(resp[0].status).json(resp);
});

module.exports = app;
