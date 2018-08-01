const { Task } = require('../../models/task');

const taskFactory = (properties, userId, tags = []) => new Task(
  Object.assign({
    name: 'dummyTask',
    start: Date.parse('02 02 2018'),
    end: Date.parse('02 03 2018'),
    user_id: userId,
    tags
  }, properties)
);

module.exports = {
  taskFactory
};
