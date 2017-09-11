// var request = require('request');
var Client = require('node-rest-client').Client;
var client = new Client();
var pokemon1;
var pokemon2;

module.exports = function(app) {

	//Home route
	app.get('/', function(req, res) {
		// res.send('Welcome to the PokeMon API Routes!');
		res.write('WelCome to My PokeMon API!' + '\n');
		res.write('This is a test');
		res.end();
	});

	//Route for an attack information from a single ID
	app.get('/attack/:id', function(req, res) {

		var id = parseInt(req.params.id);

		if (isNaN(id) === false) {
			attackView(id).then(function(data) {
				res.json({attack: data});
			});
		} else {
			console.log("please pass a number");
			res.redirect('/');
		}
	});

	//Route for battle of 2 pokemon based on ID's
	app.get('/battle/:pokemon1/:pokemon2', function(req,res) {

		var pokemonId1 = req.params.pokemon1;
		var pokemonId2 = req.params.pokemon2;

		client.get('http://pokeapi.co/api/v2/pokemon/' + pokemonId1 + '/', function(data, res) {

			pokemonSet1 = {
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
				attack: {}
			};
			attackSet(pokemonSet1).then(function(data) {
				console.log("first pokemon loaded");
				pokemon1 = data;
				checkForGame();
			});
		});

		client.get('http://pokeapi.co/api/v2/pokemon/' + pokemonId2 + '/', function(data, res) {

			pokemonSet2 = {
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
				attack: {}
			};
			attackSet(pokemonSet2).then(function(data) {
				console.log("second pokemon loaded");
				pokemon2 = data;
				checkForGame();
			});
		});
	});


	app.get('/overview/:id', function(req, res) {
		//The ID must be a number
		var id = parseInt(req.params.id);

		if (isNaN(id) === false) {
			overView(id).then(function(data) {
				res.json({overview: data});
			});
		} else {
			console.log("please pass a number");
			res.redirect('/');
		}
	});


	app.get('/tests', function(req, res) {
		if (pokemon === undefined || pokemon === null) {
			res.redirect('/');
		}
		res.send(pokemon);
	});


	app.get("*", function(req, res) {
		console.log('No PokeMon found here....');
		res.send('No PokeMon found here....');
	});

	//Set Attack names and hit power to the pokemon Obj.
	function attackSet(char) {
		return new Promise(function(resolve, reject) {
			var count = 0;
			for (var i = 0; i < char.moves.length; i++) {
				client.get(char.moves[i], function(data, res) {
					if (data.power !== null) {
						count++;
						char.attack[data.name] = data.power;
						if (count === char.moves.length) {
							resolve(char);
						}
					}
				});
			}
		});
	};

	function overView(id) {
		return new Promise(function(resolve, reject) {
			client.get('http://pokeapi.co/api/v2/pokemon/' + id + '/', function(data, res) {
				pokemon = {
					name: data.name,
					exp: data.base_experience,
					hp: data.stats[data.stats.length - 1].base_stat,
					weight: data.weight,
					element: data.types[0].type.name
				};
				resolve(pokemon);
			});
		});
	};

	//Sets the Pokemon Attack name and hit power.
	function attackView(id) {
		return new Promise(function(resolve, reject) {
			client.get('https://pokeapi.co/api/v2/move/' + id + '/', function(data, res) {
				attack = {
					attack_name: data.name,
					power: data.power,
					accuracy: data.accuracy
				};
				resolve(attack);
			});
		});
	};

	function display(x) {
		return new Promise(function(resolve, reject) {
			var hp = x.hp;
			var name = x.name;
			resolve(name);
		});
	};


	//Middle man function that will start the Battle if two pokemon are loaded.
	function checkForGame(pokemon) {
		if (pokemon1 && pokemon2) {
			console.log("Start Match!");
			battle(pokemon1, pokemon2);
		} else {
			console.log("Waiting on Players");
		}
	};

	function battle(x, y) {

		var player1 = x;
		var player2 = y;

		var attack1 = Object.keys(x.attack);
		var attack2 = Object.keys(y.attack);

		var turn = 0;
		console.log(attack1);
		console.log(player1.attack[attack1[Math.floor(Math.random() * attack1.length)]]);
		// console.log("========================================");
		// console.log(x.attack);
		// console.log("========================================");
		// console.log(y.attack);
		// console.log("========================================");
		// while (player1.hp > 0 && player2.hp >0) {
		// 	if (turn === 0) {
		// 		player2.hp = player2.hp - player1.attack[attack1[Math.floor(Math.random() * attack1.length)]];
		// 	}
		// 	if (turn === 1) {
		// 		console.log('player 2 turn');
		// 	}
		// }
	};



};