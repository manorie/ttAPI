const { pick } = require('lodash');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const { logger } = require('../logger');

const register = (req, res) => {
  const { name, email, password } = req.body || {};

  let hashedPassword;
  if (password) {
    hashedPassword = bcrypt.hashSync(password, 8);
  }

  User.create({
    name,
    email,
    password: hashedPassword
  })
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
