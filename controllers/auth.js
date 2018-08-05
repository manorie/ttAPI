const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isEmail } = require('validator');
const { User } = require('../models/user');
const { logger } = require('../logger');
const { secret } = require('../config/env');

const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      message: 'email and password is required'
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

  let user;
  try {
    user = await User.findOne({ email });
  }
  catch (err) {
    const {
      message = 'server error'
    } = err;
    logger.error(err);
    res.status(500).send({ message });
  }

  if (!user) {
    return res.status(400).json({
      message: 'invalid email address or password'
    });
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);

  if (!passwordIsValid) {
    return res.status(400).json({
      message: 'invalid email address or password'
    });
  }

  const token = jwt.sign({
    exp: (Date.now() / 1000) + (60 * 60),
    id: user._id
  }, secret);

  return res.status(200).send({
    id: user._id,
    auth: true,
    token
  });
};

module.exports = {
  login
};
