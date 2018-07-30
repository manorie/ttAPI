const { Task } = require('../../models/task');

const tagFactory = (properties, userId, tags = []) => new Task(
  Object.assign({
    name: 'dummyTask',
    startedAt: Date.parse('01 01 2018'),
    endedAt: Date.parse('01 02 2018'),
    _user: userId,
    tags
  }, properties)
);

module.exports = {
  tagFactory
};
