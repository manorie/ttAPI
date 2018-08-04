const { pick } = require('lodash');
const { User } = require('../models/user');
const { logger } = require('../logger');

const register = (req, res) => {
  const { name, email, password } = req.body || {};

  User.create({ name, email, password })
    .then((user) => {
      res.json(pick(user, ['_id', 'name', 'email']));
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send(err);
    });
};

module.exports = {
  register
};
