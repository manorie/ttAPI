const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const { logger } = require('./logger');
const { mongoURI, port } = require('./config/env');

mongoose.connect(mongoURI, { useNewUrlParser: true });

const app = express();
app.use(morgan('combined', { stream: logger.stream }));

app.use('/', (req, res) => res
  .status(200)
  .send({
    message: 'You shall not pass!'
  }));

const server = app.listen(port, () => {
  logger.info(`listening on port ${port}`);
});

module.exports = {
  server
};
