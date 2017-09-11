var express = require('express');
var PORT = process.env.PORT || 3000;

var app = express();

require('./api/route.js')(app);

app.listen(PORT, function() {
	console.log('App running of port ' + PORT);
});