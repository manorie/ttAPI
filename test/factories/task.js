const { Task } = require('../../models/task');

const taskFactory = (properties, userId, tags = []) => new Task(
  Object.assign({
    name: 'dummyTask',
    startedAt: Date.parse('01 01 2018'),
    endedAt: Date.parse('01 02 2018'),
    user_id: userId,
    tags
  }, properties)
);

module.exports = {
  taskFactory
};
