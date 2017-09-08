// var request = require('request');
var Client = require('node-rest-client').Client;
var client = new Client();
var pokemon;
var pokemon2;

module.exports = function(app) {

	app.get('/', function(req, res) {
		res.send('Welcome to the PokeMon API Routes!');
	});



	app.get('/attack', function(req, res) {
		if (pokemon === undefined || pokemon === null) {
			res.send('please select a pokemon');
			console.log('please select a pokemon');
		} else {
			for (var i = 0; i < pokemon.moves.length; i++) {
				client.get(pokemon.moves[i], function(data, res) {
					console.log(data.name);
					console.log(data.power);
					pokemon.moves2[data.name] = data.power;
				});
			}
			console.log(pokemon);
		}
	});



	app.get('/overview/:id', function(req, res) {

		var id = req.params.id;
		console.log(id);

		client.get('http://pokeapi.co/api/v2/pokemon/' + id + '/', function(data, res) {

			pokemon = {
				name: data.name,
				exp: data.base_experience,
				hp: data.stats[data.stats.length - 1].base_stat,
				weight: data.weight,
				element: data.types[0].type.name,
				moves: [
					data.moves[0].move.url,
					data.moves[1].move.url,
					data.moves[2].move.url,
					data.moves[3].move.url
				],
				moves2: {}
			};

			console.log('this is the return');
			console.log(pokemon);
		});
	});


	app.get('/tests', function(req, res) {
		res.send(pokemon);
	});



	app.get('/all', function(req, res) {
		client.get('http://pokeapi.co/api/v2/pokemon/?limit=251', function(data, res) {
			console.log(data);
		});
	});
};