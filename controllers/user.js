const { pick } = require('lodash');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const { logger } = require('../logger');

const register = (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'name, email and password is required'
    });
  }

  if (!isEmail(email)) {
    return res.status(400).json({
      message: 'invalid email address'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: 'password is too short'
    });
  }

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
      res.status(500).send(pick(err, ['code', 'message']));
    });
};

module.exports = {
  register
};
