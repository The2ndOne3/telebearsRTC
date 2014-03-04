var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: String,
  password: String,
  email: String,

  phone: String,

  alerts: {
    text: Boolean,
    email: Boolean
  },

  confirmation: {
    email: String,
    text: Date
  },

  watching: [{
    ccn: String,
    title: String,
    professor: String,
    time: String
  }]
});

userSchema.plugin(require('passport-local-mongoose'), {
  usernameField: 'email'
});

module.exports = mongoose.model('User', userSchema);
