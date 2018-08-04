const jwt = require('jsonwebtoken');

const verifyToken = (req, secret) => new Promise(async (resolve, reject) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    reject(new Error('token is not present'));
  }

  try {
    const { id } = await jwt.verify(token, secret);
    req.userID = id;
    resolve({ message: 'you have a valid token' });
  }
  catch (e) {
    reject(new Error('token verification failed'));
  }
});

module.exports = {
  verifyToken
};
