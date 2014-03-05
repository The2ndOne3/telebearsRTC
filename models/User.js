var mongoose = require('mongoose')
  , shortid = require('shortid')
  , moniker = require('moniker');

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
    ccn: String
  }]
});

userSchema.addEmail = function(email, callback) {
  this.update({
    $push: {
      'emails': {
        address: email,
        token: shortid.generate(),
        confirmed: false
      }
    }
  }, callback);
  // TODO: send confirmation email here.
};

userSchema.removeEmail = function(email, callback) {
  this.update({
    $pull: {
      'emails': {
        address: email
      }
    }
  }, callback);
};

userSchema.changeEmail = function(from, to, callback) {
  this.removeEmail(from, function(err, result) {
    if (err) {
      return callback(err, null);
    }
    this.addEmail(to, callback);
  });
};

userSchema.addPhone = function(phone, callback) {
  this.update({
    $push: {
      'phone': {
        number: phone,
        token: moniker.choose(),
        confirmed: false
      }
    }
  }, callback);
  // TODO: send confirmation text here.
};

userSchema.removePhone = function(phone, callback) {
  this.update({
    $pull: {
      'phone': {
        number: phone
      }
    }
  }, callback);
};

userSchema.changePhone = function(from, to, callback) {
  this.removePhone(from, function(err, result) {
    if (err) {
      return callback(err, null);
    }
    this.addPhone(to, callback);
  });
};

userSchema.plugin(require('passport-local-mongoose'));

module.exports = mongoose.model('User', userSchema);
