var debug = require('debug')('passport-mongo');
var app = require('./app');

//set server port to 3000
app.set('port', process.env.PORT || 8080);

//listen for connections on port 3000
var server = app.listen(app.get('port'), function () {
  debug('Express server listening on port ' + server.address().port);
});

//
