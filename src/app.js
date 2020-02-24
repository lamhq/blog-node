const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { stream: logStream, logError, logInfo } = require('./common/log');
const { notFoundError, serverError } = require('./common/utils');
const router = require('./router');

const app = express();

// enable parsing request boby with different content types
app.use(bodyParser.json());

// log http request
app.use(morgan(':remote-addr :method :url :status - :response-time ms', {
  stream: logStream,
}));

// application router
app.use(router);

// catch 404 and forward to error handler
app.use((req, res, next) => next(notFoundError('No route found')));

// error handler
app.use((err, req, res, next) => {
  let resp = {};
  // dedicated error throw in code
  if (err.status) {
    resp = err;
  } else { // unknow exception
    resp = serverError();
    logInfo('Request headers: %s', JSON.stringify(req.headers));
    logInfo('Request body: %s', JSON.stringify(req.body));
    logError(err.stack);
  }

  // return an array of errors
  const { status, ...data } = resp;
  res.status(status).json(data);
});

module.exports = app;
