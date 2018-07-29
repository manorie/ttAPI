const mongoose = require('mongoose');

const { Schema } = mongoose;

// eslint-disable-next-line
const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required']
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    validate: {
      validator: v => emailRe.test(v.toLowerCase()),
      message: '{VALUE} is not a valid email address'
    }
  },
  password: {
    type: String,
    required: [true, 'password is required']
  }
});

let User;
try {
  User = mongoose.model('User', userSchema);
}
catch (e) {
  User = mongoose.model('User');
}

module.exports = {
  User
};
