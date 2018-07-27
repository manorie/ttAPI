const express = require('express');
const morgan = require('morgan');

const { logger } = require('./logger');
const { port } = require('./config/env');

const app = express();
app.use(morgan('combined', { stream: logger.stream }));

app.use('/', (req, res) => res
  .status(200)
  .send('Hell'));

const server = app.listen(port, () => {
  logger.info(`listening on port ${port}`);
});

module.exports = {
  server
};
