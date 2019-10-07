require('dotenv').config();
const http = require('http');
const app = require('./app');
const { port } = require('./config');
const log = require('./src/common/log');
const { connectToDb } = require('./src/common/helpers');

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
      log.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;

    case 'EADDRINUSE':
      log.error(`${bind} is already in use`);
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
  log.info(`Web server listening on ${bind}`);
}

/**
 * Start the api server
 */
async function run() {
  try {
    await connectToDb();
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  } catch (error) {
    log.error(error);
    process.exit(1);
  }
}

run();

module.exports = server;
