const jwt = require('jsonwebtoken');
const { secret } = require('../config/env');

const verifyToken = req => new Promise(async (resolve, reject) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    reject(new Error('token is not present'));
  }

  try {
    const { id } = await jwt.verify(token, secret);
    req.id = id;
    resolve({ message: 'you have a valid token' });
  }
  catch (e) {
    reject(new Error('token verification failed'));
  }
});

module.exports = {
  verifyToken
};
