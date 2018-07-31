const mongoose = require('mongoose');

const { Schema } = mongoose;

const tagSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'user is required']
  },
  name: {
    type: String,
    required: [true, 'name is required']
  }
});

tagSchema.index({ user_id: 1, name: 1 }, { unique: true });

let Tag;
try {
  Tag = mongoose.model('Tag', tagSchema);
}
catch (e) {
  Tag = mongoose.model('Tag');
}

module.exports = {
  Tag
};
