var mongoose = require('mongoose')
  , _ = require('underscore')
  , config = process.env

  , shortid = require('shortid')
  , moniker = require('moniker')

  , request = require('request')
  , sendgrid = require('sendgrid')(config.SENDGRID_USERNAME, config.SENDGRID_PASSWORD);

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

userSchema.methods.sendAlert = function(ccn, data) {
  if (this.alerts.text) {
    _.each(this.phone, function(ph) {
      if (ph.confirmed || true) {
        var message = 'http://api.tropo.com/1.0/sessions?' +
          'action=create' +
          '&token=23c7ef4921f66e4eb92f03f594bad4fb02c28e7f3be95f3826983ee80a88ffb2e9af759a74922b9b55c135ce';

        message += '&numberToDial=' + ph.number;
        message += '&msg=' + 'Enrollment change for section ' +
          ccn + ' ' + data.enrollment.current + '/' + data.enrollment.limit + ' students enrolled';
        message.replace(' ', '+');
        request(message, function(err, result) {
          if (err) {
            return console.error('[ERROR] Could not send text', err);
          }
        });
      }
    });
  }
  if (this.alerts.email) {
    _.each(this.email, function(em) {
      if (em.confirmed || true) {
        sendgrid.send({
          to: em,
          from: 'alert@telebearsrtc.com',
          subject: 'Enrollment Alert',
          text: 'Section ' + ccn +
            ' now has ' + data.enrollment.current +
            ' students out of a total capacity of ' + data.enrollment.limit +
            ' with an additional ' + data.waitlist.current + '/' + data.waitlist.limit +
            ' on the waitlist'
        }, function(err, json) {
          if (err) {
            return console.error(err);
          }
          console.log('[DEBUG] Email successful', json);
        });
      }
    });
  }
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
