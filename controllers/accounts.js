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
      email: req.body.email,
      watching: []
    }), req.body.password, function(err, user) {
      console.log(err);
      if (err) {
        return res.render('login', {err: err.message});
      }

      res.redirect('/account');
    });
  });


  app.get('/account', function(req, res) {
    if (!req.user) {
      res.redirect('/login');
    }
    res.render('account', {
      user: req.user
    });
  });


  app.post('/subscribe/:ccn', function(req, res) {
    ;
  });

  app.post('/unsubscribe/:ccn', function(req, res) {
    ;
  });

  app.post('/account/:field/:value', function(req, res) {
    ;
  });

  app.put('/account/:field/:value', function(req, res) {
    ;
  });

  app.delete('/account/:field/:value', function(req, res) {
    ;
  });
};
