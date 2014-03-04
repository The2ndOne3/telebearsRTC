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
      name: req.body.name,
      email: req.body.email,
      watching: []
    }), req.body.password, function(err, user) {
      if (err) {
        return res.render('/login', {err: err});
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

  app.get('/subscribe/:ccn', function(req, res) {
    ;
  });
};
