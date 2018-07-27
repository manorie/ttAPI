const express = require('express');
const morgan = require('morgan');

const { logger } = require('./logger');
const { port } = require('./config/env');

const app = express();
app.use(morgan('combined', { stream: logger.stream }));

app.use('/', (req, res) => {
  return res
    .status(200)
    .send('Hello')
})

app.listen(port, () => {
  logger.info(`listening on port ${port}`);
})