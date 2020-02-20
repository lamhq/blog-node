require('dotenv').config();
const http = require('http');
const app = require('./app');
const { port } = require('./config');
const { logInfo, logError } = require('./common/log');
const { connectToDb } = require('./common/helpers');

const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logError(`${bind} requires elevated privileges`);
      process.exit(1);
      break;

    case 'EADDRINUSE':
      logError(`${bind} is already in use`);
      process.exit(1);
      break;

    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}` : `port ${addr.port}`;
  logInfo(`Web server listening on ${bind}`);
}

/**
 * Start the api server
 */
async function run() {
  try {
    await connectToDb();
    logInfo('Connected to database.');
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  } catch (error) {
    logError(error);
    process.exit(1);
  }
}

run();

module.exports = server;
