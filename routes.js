const User = require('./controllers/user');

module.exports = (api) => {
  api.route('/register').post(User.register);
};
