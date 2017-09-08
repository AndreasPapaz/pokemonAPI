var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var PORT = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.text());
// app.use(bodyParser.json({ type: "application/vnd.api+json" }));
// app.use(express.static(__dirname + '/public/assets'));
// app.use(express.static('public'));

require('./api/route.js')(app);

app.listen(PORT, function() {
	console.log('App running of port ' + PORT);
});