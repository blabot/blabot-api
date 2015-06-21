var express = require('express');
var app = express();
var v2 = require('./src/router-v2');

app.get('/', function (req, res) {
  res.send('Welcome to Blabot API…');
});

app.use('/v2', v2);

app.use(function(err, req, res, next) {
  console.log(err);
  res.status(500).json({'message': err.message});
});

//var serverPort = process.env.OPENSHIFT_NODEJS_PORT || 3000;
//var serverIP = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.PORT || 3000;        // set our port

app.listen(port, function () {
  console.log( "Listening on: "  + port )
});
