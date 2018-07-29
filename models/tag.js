const mongoose = require('mongoose');

const { Schema } = mongoose;

const tagSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'user is required']
  },
  name: {
    type: String,
    required: [true, 'name is required']
  }
});

tagSchema.index({ _user: 1, name: 1 }, { unique: true });

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
