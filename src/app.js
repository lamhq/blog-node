const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { stream: logStream, logError } = require('./common/log');
const { notFoundError } = require('./common/utils');
const router = require('./router');

const app = express();

// enable parsing request boby with different content types
app.use(bodyParser.json());

// log http request
app.use(morgan(':remote-addr :method :url :status - :response-time ms', { stream: logStream }));

// application router
app.use(router);

// catch 404 and forward to error handler
app.use((req, res, next) => next(notFoundError('No route found')));

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
      // uncaught exception, og error
      logError(err.message, {
        request: {
          url: req.originalUrl,
          method: req.method,
          body: req.body,
          headers: req.headers,
          ip: req.ip,
        },
        error: {
          stack: err.stack,
          message: err.message,
        },
      });
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
