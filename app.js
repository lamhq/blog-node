const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('./src/common/log');
const sentry = require('./src/common/sentry');
const { notFoundExc } = require('./src/common/helpers');
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
app.use((req, res, next) => next(notFoundExc('No route found')));

sentry.addErrorHandler(app);

// error handler
app.use((err, req, res, next) => {
  // errors thrown by app
  if (err.status) {
    const { status, ...data } = err;
    res.status(status).json(data);
  } else {
    // uncaught exception
    logger.error(err);
    res.status(500).json({
      code: 'server_error',
      message: err.message,
    });
  }
});

module.exports = app;
