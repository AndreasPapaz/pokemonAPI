// var request = require('request');
var Client = require('node-rest-client').Client;
var client = new Client();

module.exports = function(app) {

	app.get('/', function(req, res) {
		res.send('Welcome to the PokeMon API Routes!');
	});

	app.get('/tests', function(req, res) {
		client.get('http://pokeapi.co/api/v2/pokemon/5/', function(data, res) {
			var pName = data.name;
			console.log('this is the return');
			console.log(pName);
		});
	});

	app.get('/pokemon/:id', function(req, res) {

		var id = req.params.id;
		console.log(id);

		client.get('http://pokeapi.co/api/v2/pokemon/' + id + '/', function(data, res) {

			var pokemon = {
				name: data.name,
				exp: data.base_experience,

			}

			console.log('this is the return');
			// console.log(data.abilities);
			// console.log(data.stats); //this has attack and HP
		});
	});
};