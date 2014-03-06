var path = require('path')

  , TOTP = require('onceler').TOTP

  , config = process.env
  , key = config.SECRET

  , totp = new TOTP(key, null, 60)
  , Section = require(path.join('..', 'models', 'Section'))
  , User = require(path.join('..', 'models', 'User'));

module.exports = function(app) {
  // Initialise enrollments because we don't want to initially pull ~8900 sections.
  app.post('/poll/:key/:ccn/:enroll/:enrollLimit/:waitlist/:waitlistLimit/:init', function(req, res) {
    if (config.NODE_ENV == 'production') {
      if (!totp.verify(req.params.key)) {
        return res.send(403);
      }
    }

    Section.update({
      ccn: req.params.ccn
    }, {
      enrollment: {
        current: req.params.enroll,
        limit: req.params.enrollLimit
      },
      waitlist: {
        current: req.params.waitlist,
        limit: req.params.waitlistLimit
      }
    }, function(err, result) {
      if (err) {
        console.error('[ERROR] Polling update error for class', req.params.ccn, err);
      }
    });

    console.log('[DEBUG] Received initial update for class', req.params.ccn);
  });

  // Update enrollments.
  app.post('/poll/:key/:ccn/:enroll/:enrollLimit/:waitlist/:waitlistLimit', function(req, res) {
    if (!totp.verify(req.params.key)) {
      return res.send(403);
    }

    Section.update({
      ccn: req.params.ccn
    }, {
      enrollment: {
        current: req.params.enroll,
        limit: req.params.enrollLimit,
        updated: Date.now()
      },
      waitlist: {
        current: req.params.waitlist,
        limit: req.params.waitlistLimit,
        updated: Date.now()
      }
    }, function(err, result) {
      if (err) {
        console.error('[ERROR] Polling update error for class', req.params.ccn, err);
      }
    });

    console.log('[DEBUG] Received update for class', req.params.ccn);

    // TODO: send alerts.

  });
};
