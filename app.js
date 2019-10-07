const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('./modules/common/log');
const sentry = require('./modules/common/sentry');
const { notFoundExc } = require('./modules/common/helpers');
const appRouter = require('./modules/app/router');
const blogRouter = require('./modules/app/admin/post/router');
const adminRouter = require('./modules/app/admin/account/router');
const commonRouter = require('./modules/common/router');

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

// add module's middlewares
app.use('/api/v1', [
  commonRouter,
  appRouter,
  blogRouter,
  adminRouter,
]);

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
