'use strict';

var http = require('http')
  , app = require('./app');

module.exports = function(callback){
  var server = http.createServer(app);

  server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
    callback(server);
  });
};
