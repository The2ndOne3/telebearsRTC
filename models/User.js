var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  emails: [{
    address: String,
    token: String,
    confirmed: {
      type: Boolean,
      default: false
    }
  }],

  phone: [{
    number: String,
    token: String,
    confirmed: {
      type: Boolean,
      default: false
    }
  }],

  alerts: {
    text: {
      type: Boolean,
      default: false
    },
    email: {
      type: Boolean,
      default: false
    }
  },

  watching: [{
    ccn: String,
    title: String,
    time: String
  }]
});

userSchema.plugin(require('passport-local-mongoose'));

module.exports = mongoose.model('User', userSchema);
