const winston = require('winston');

const {
  combine,
  colorize,
  splat,
  printf,
  timestamp: timestampFormat,
} = winston.format;

const logColors = {
  warn: 'yellow',
  info: 'green',
  debug: 'magenta',
  error: 'red',
};

// custom log format that add current date time
const withTimeFormat = printf(({ level, message, timestamp }) => {
  const tm = new Date(timestamp);
  return `${tm.toString()} ${level}: ${message}`;
});

// list of chained formats
const formats = [
  process.env.NODE_ENV === 'dev' ? colorize({ colors: logColors }) : null,
  timestampFormat(),
  splat(),
  withTimeFormat,
].filter((e) => !!e);

// winston logger instance
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      // define how the log was displayed
      format: combine(...formats),
      // log all levels data to console
      // levels: error=0, warn=1, info=2, verbose=3, debug=4, silly=5
      level: 'silly',
    }),
  ],
});

// use for logging http request with morgan
const stream = {
  write(message) {
    logger.info(message);
  },
};

module.exports = {
  stream,
  logInfo: logger.info,
  logError: logger.error,
  logWarning: logger.warn,
};
