const winston = require('winston');
const Elasticsearch = require('winston-elasticsearch');

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

    new Elasticsearch({
      format: winston.format.combine(
        winston.format.json(),
      ),
      level: 'error',
      indexPrefix: 'rest-server',
      transformer: (logData) => {
        return {
          '@timestamp': (new Date()).getTime(),
          severity: logData.level,
          message: logData.message,
          fields: logData.meta,
        };
      },
      clientOpts: {
        node: 'http://localhost:9200',
        apiVersion: '7.4',
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
