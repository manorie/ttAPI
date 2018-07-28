const { createLogger, format, transports } = require('winston');

const {
  combine,
  timestamp,
  printf
} = format;

const myFormat = printf(info => `${info.timestamp}[${info.level}]: ${info.message}`);

const logger = createLogger({
  format: combine(
    timestamp(),
    myFormat,
  ),
  transports: [new transports.Console()]
});

logger.stream = {
  write(message) {
    logger.info(message);
  }
};

module.exports = {
  logger
};
