const mongoose = require('mongoose');

const { Schema } = mongoose;

const dateValidator = ({ endDate, startDate }) => endDate <= startDate;

const taskSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'user is required']
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ],
  name: {
    type: String,
    required: [true, 'name is required']
  },
  startedAt: {
    type: Date,
    default: Date.now,
    required: [true, 'start date is required']
  },
  endedAt: {
    type: Date,
    required: [true, 'end date is required'],
    validate: [dateValidator, 'start date should be less than end date']
  }
});


let Task;
try {
  Task = mongoose.model('Task', taskSchema);
}
catch (e) {
  Task = mongoose.model('Task');
}

module.exports = {
  Task
};
