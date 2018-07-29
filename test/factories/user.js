const { User } = require('../../models/user');

const userFactory = properties => new User(
  Object.assign({
    name: 'manorie',
    email: 'manorie@example.com',
    password: 'hashedPassword'
  }, properties)
);

module.exports = {
  userFactory
};
