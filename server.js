var express = require('express');
var app = express();
var v2 = require('./src/router-v2');

var port = process.env.PORT || 3000;        // set our port

app.get('/', function (req, res) {
  res.send('Welcome to Blabot API…');
});

app.use('/v2', v2);

app.use(function(err, req, res, next) {
  console.log(err);
  res.status(500).json({'message': err.message});
});


//var server = app.listen(3000, function () {
//  var host = server.address().address;
//  var port = server.address().port;
//  console.log('Example app listening at http://%s:%s', host, port);
//});
app.listen(port);
console.log('Magic happens on port ' + port);
