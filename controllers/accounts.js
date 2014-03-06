var path = require('path')

  , mongoose = require('mongoose')
  , passport = require(path.join('..', 'lib', 'auth'))

  , User = require(path.join('..', 'models', 'User'));

module.exports = function(app) {
  app.get('/login', function(req, res) {
    res.render('login', {
      title: 'Login',
      err: req.flash('error'),
      user: req.user
    });
  });

  app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }), function(req, res) {
    res.redirect('/account');
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.post('/signup', function(req, res) {
    User.register(new User({
      username: req.body.username,
      watching: []
    }), req.body.password, function(err, user) {
      console.log(err);
      if (err) {
        return res.render('login', {
          title: 'Login',
          err: err.message
        });
      }

      User.addEmail(req.body.email, function(err) {
        res.redirect('/account');
      });
    });
  });


  app.get('/account', function(req, res) {
    if (!req.user) {
      res.redirect('/login');
    }
    res.render('account', {
      user: req.user,
      title: req.user.username
    });
  });


  app.post('/subscribe/:ccn', function(req, res) {
    if (!req.user) {
      return res.send(403);
    }

    User.update({username: req.user.username}, {
      $push: {
        'watching': {
          ccn: req.params.ccn,
        }
      }
    }, function(err) {
      if (err) {
        console.error('[ERROR] User not updated:', req.user, err);
        return res.send(500);
      }

      res.send(200, {
        success: true
      });
    });
  });

  app.post('/unsubscribe/:ccn', function(req, res) {
    if (!req.user) {
      return res.send(403);
    }

    User.update({username: req.user.username}, {
      $pull: {
        'watching': {
          ccn: req.params.ccn,
        }
      }
    }, function(err) {
      if (err) {
        console.error('[ERROR] User not updated:', req.user, err);
        return res.send(500);
      }

      res.send(200, {
        success: true
      });
    });
  });

  app.post('/account/:field/:value', function(req, res) {
    if (!req.user) {
      return res.send(403);
    }

    User.find({username: req.user.username}, function(err, user) {
      if (err) {
        console.error('[ERROR] User not found:', req.user, err);
        return res.send(500);
      }

      if (req.params.field == 'email') {
        user.addEmail(req.params.value, function(err, result) {
          if (err) {
            console.error('[ERROR] User not updated:', req.user, err);
            return res.send(500);
          }

          res.send(200, {
            success: true
          });
        });
      } else {
        user.addPhone(req.params.value, function(err, result) {
          if (err) {
            console.error('[ERROR] User not updated:', req.user, err);
            return res.send(500);
          }

          res.send(200, {
            success: true
          });
        });
      }
    });
  });

  app.put('/account/:field/:value', function(req, res) {
    if (!req.user) {
      return res.send(403);
    }

    User.find({username: req.user.username}, function(err, user) {
      if (err) {
        console.error('[ERROR] User not found:', req.user, err);
        return res.send(500);
      }

      if (req.params.field == 'email') {
        user.changeEmail(req.params.value, function(err, result) {
          if (err) {
            console.error('[ERROR] User not updated:', req.user, err);
            return res.send(500);
          }

          res.send(200, {
            success: true
          });
        });
      } else {
        user.changePhone(req.params.value, function(err, result) {
          if (err) {
            console.error('[ERROR] User not updated:', req.user, err);
            return res.send(500);
          }

          res.send(200, {
            success: true
          });
        });
      }
    });
  });

  app.delete('/account/:field/:value', function(req, res) {
    if (!req.user) {
      return res.send(403);
    }

    User.find({username: req.user.username}, function(err, user) {
      if (err) {
        console.error('[ERROR] User not found:', req.user, err);
        return res.send(500);
      }

      if (req.params.field == 'email') {
        user.removeEmail(req.params.value, function(err, result) {
          if (err) {
            console.error('[ERROR] User not updated:', req.user, err);
            return res.send(500);
          }

          res.send(200, {
            success: true
          });
        });
      } else {
        user.removePhone(req.params.value, function(err, result) {
          if (err) {
            console.error('[ERROR] User not updated:', req.user, err);
            return res.send(500);
          }

          res.send(200, {
            success: true
          });
        });
      }
    });
  });


  app.get('/confirm/email/:token', function(req, res) {
    ;
  });

  app.get('/confirm/phone/:token', function(req, res) {
    ;
  });
};
