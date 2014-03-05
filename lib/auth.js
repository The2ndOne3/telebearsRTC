var path = require('path')

  , passport = require('passport')
  , User = require(path.join('..', 'models', 'User'));

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;
