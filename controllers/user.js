const { pick } = require('lodash');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const { logger } = require('../logger');

const register = async (req, res) => {
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

  let user;
  try {
    user = await User.create({
      name,
      email,
      password: hashedPassword
    });
  }
  catch (err) {
    logger.error(err);
    res.status(500).send(pick(err, ['code', 'message']));
  }
  return res.json(pick(user, ['_id', 'name', 'email']));
};

module.exports = {
  register
};
