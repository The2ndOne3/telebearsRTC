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

userSchema.methods.sendAlert = function() { // Should this have a callback? Pass it any errors that occur?
  if (this.alerts.text) {
    ;
  }
  if (this.alerts.email) {
    ;
  }
  // TODO: send alerts to confirmed and active email/phones
};

userSchema.methods.addEmail = function(email, callback) {
  this.update({
    $push: {
      emails: {
        address: email,
        token: shortid.generate(),
        confirmed: false
      }
    }
  }, callback);
  // TODO: send confirmation email here.
};

userSchema.methods.removeEmail = function(email, callback) {
  this.update({
    $pull: {
      emails: {
        address: email
      }
    }
  }, callback);
};

userSchema.methods.changeEmail = function(from, to, callback) {
  this.removeEmail(from, function(err, result) {
    if (err) {
      return callback(err, null);
    }
    this.addEmail(to, callback);
  });
};

userSchema.methods.confirmEmail = function(email, callback) {
  this.update({
    emails: {
      address: email
    }}, {
      $set: {
        'emails.$.confirmed': true
      }
    }, callback);
};

userSchema.methods.addPhone = function(phone, callback) {
  this.update({
    $push: {
      phone: {
        number: phone,
        token: moniker.choose(),
        confirmed: false
      }
    }
  }, callback);
  // TODO: send confirmation text here.
};

userSchema.methods.removePhone = function(phone, callback) {
  this.update({
    $pull: {
      phone: {
        number: phone
      }
    }
  }, callback);
};

userSchema.methods.changePhone = function(from, to, callback) {
  this.removePhone(from, function(err, result) {
    if (err) {
      return callback(err, null);
    }
    this.addPhone(to, callback);
  });
};

userSchema.methods.confirmEmail = function(phone, callback) {
  this.update({
    phone: {
      number: phone
    }}, {
      $set: {
        'phone.$.confirmed': true
      }
    }, callback);
};

userSchema.plugin(require('passport-local-mongoose'));

module.exports = mongoose.model('User', userSchema);
