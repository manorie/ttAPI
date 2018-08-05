const User = require('./controllers/user');
const Auth = require('./controllers/auth');

module.exports = (api) => {
  api.route('/register').post(User.register);
  api.route('/login').post(Auth.login);
};
