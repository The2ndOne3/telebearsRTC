var express = require('express')
  , path = require('path')

  , enrouten = require('express-enrouten')
  , helmet = require('helmet')

  , jade = require('jade')
  , stylus = require('stylus')
  , nib = require('nib');

var app = express();
app.set('port', process.env.PORT || 3000);

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

if('production' == app.get('env')){
  app.use(express.compress());
}

helmet.defaults(app);

app.use(express.logger('dev'));
app.use(express.favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(stylus.middleware({
  src: path.join(__dirname, 'public'),
  compile: function (str, path) {
    return stylus(str)
      .set('filename', path)
      .set('compress', true)
      .use(nib());
  }
}));

if('production' == app.get('env')){
  app.use(express.static(path.join(__dirname, '.build')));
} else {
  app.use(express.static(path.join(__dirname, 'public')));
}

var url = require('url');

app.use(enrouten({
  directory: 'controllers'
}));
app.use(function(req, res, next){
  try{
    res.render(path.join(app.get('views'), url.parse(req.url).pathname.substr(1)));
  }
  catch(e){
    next();
  }
});

if('production' == app.get('env')){
  app.use(function(err, req, res, next){
    if(err.message.indexOf('Failed to lookup view') != -1 && err.view){
      res.status(404).render('404', {code: 404, title: 'Errorrrrrrrr'});
    }
    else{
      console.error('[ORBIT ERR]', err);
      res.status(500).render('404', {code: 500});
    }
  });
} else {
  app.use(express.errorHandler());
}

module.exports = app;
