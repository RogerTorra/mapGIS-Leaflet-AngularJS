/*var gzippo = require('gzippo');
var express = require('express');
var app = express();
var logger = require('morgan');

app.use(logger('dev'));
app.use(gzippo.staticGzip("" + __dirname + "/dist"));
app.listen(3000, function () {
  console.log('Example app listening on port 5000!')
});*/

var express = require('express');
var logger = require('morgan');
var app = express();

app.use(logger('dev'));
app.use(express.static(__dirname + '/dist'));

app.get('/', function(req, res){
  res.redirect('/index.html');
});

app.listen(9000);
