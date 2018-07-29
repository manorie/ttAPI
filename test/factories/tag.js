const { Tag } = require('../../models/tag');

const tagFactory = (properties, userId) => new Tag(
  Object.assign({
    name: 'dummyTag',
    user: userId
  }, properties)
);

module.exports = {
  tagFactory
};
