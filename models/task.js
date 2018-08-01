const mongoose = require('mongoose');

const { Schema } = mongoose;

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
  start: {
    type: Date,
    required: [true, 'start date is required']
  },
  end: {
    type: Date,
    required: [true, 'end date is required']
  }
});

function dateValidation(next) {
  if (this.start > this.end) {
    next(new Error('end date should be greater than start date'));
    return;
  }
  next();
}

taskSchema.pre('save', dateValidation);

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
