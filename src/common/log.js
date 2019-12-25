const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    // log all levels data to console
    // levels: error=0, warn=1, info=2, verbose=3, debug=4, silly=5
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.splat(),
        winston.format.simple(),
      ),
      level: 'silly',
      // customize color
      levels: {
        levels: 'winston.config.npm',
        colors: {
          warn: 'purple',
          info: 'green',
          debug: 'yellow',
          error: 'red',
        },
      },
    }),
  ],
});

// use for logging http request with morgan
logger.stream = {
  write(message) {
    logger.info(message);
  },
};

module.exports = logger;
