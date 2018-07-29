const { Tag } = require('../../models/tag');

const tagFactory = (properties, userId) => new Tag(
  Object.assign({
    name: 'dummyTag',
    _user: userId
  }, properties)
);

module.exports = {
  tagFactory
};
