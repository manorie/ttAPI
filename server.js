const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');

const { logger } = require('./logger');
const { mongoURI, port } = require('./config/env');
const routes = require('./routes');

mongoose.connect(mongoURI, { useNewUrlParser: true });

const app = express();
app.use(morgan('combined', { stream: logger.stream }));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({}));


app.route('/').get((req, res) => res
  .status(200)
  .send({
    message: 'You shall not pass!'
  }));

const server = app.listen(port, (err) => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }
  routes(app);

  logger.info(`listening on port ${port}`);
});

module.exports = {
  server
};
