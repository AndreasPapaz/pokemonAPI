// var request = require('request');
var Client = require('node-rest-client').Client;
var client = new Client();
var pokemon;
var pokemon1;
var pokemon2;

module.exports = function(app) {

	app.get('/', function(req, res) {
		res.send('Welcome to the PokeMon API Routes!');
	});


	app.get('/attack/:id?', function(req, res) {
		var id = req.params.id;

		client.get('http://pokeapi.co/api/v2/move/' + id + '/', function(data, res) {

			console.log(data);
		});

	});

	app.get('/battle/:pokemon1/:pokemon2', function(req,res) {

		var pokemonId1 = req.params.pokemon1;
		var pokemonId2 = req.params.pokemon2;

		client.get('http://pokeapi.co/api/v2/pokemon/' + pokemonId1 + '/', function(data, res) {

			pokemon1 = {
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
			// attack(pokemon1).then(function(data) {
			// 	checkForGame();
			// });
		});

		client.get('http://pokeapi.co/api/v2/pokemon/' + pokemonId2 + '/', function(data, res) {

			pokemon2 = {
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
			attack(pokemon2).then(function(data) {
				console.log('using the .then()');
				// console.log(data);
				checkForGame();
			});
			// checkForGame();
		});
	});


	app.get('/overview/:id', function(req, res) {

		//write a catch to make sure a number is passed from a range

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
				attack: {}
			};
			// console.log(pokemon);
			attack(pokemon);
		});
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


	// function attack(char) {
	// 	return new Promise(function(resolve, reject) {
	// 		if (char !== undefined || char !== null) {
	// 			for (var i = 0; i < char.moves.length; i++) {
	// 				client.get(char.moves[i], function(data, res) {
	// 					//this will prevent errors in battle
	// 					if (data.power !== null) {
	// 					char.attack[data.name] = data.power;
	// 					}
	// 				});
	// 			}
	// 			//I THINK I NEED TO WRITE ANOTHER FUNCTION TO CALL BACK WHEN THIS FOR LOOP IS COMPLETE
	// 		resolve(char);
	// 		// display(char);
	// 		}
	// 	});
	// }

	// function attack(char) {
	// 	return new Promise(function(resolve, reject) {
	// 		for (var i = 0; i <= char.moves.length; i++) {
	// 			if (char.attack.length === char.moves.length) {
	// 				resolve(char);
	// 			} else {
	// 				console.log(char.moves[i]);
	// 				console.log(i);
	// 				//handle async problem here
	// 				client.get(char.moves[i], function(data, res) {
	// 					if (data.power !== null) {
	// 						console.log(data.name);
	// 						char.attack[data.name] = data.power;
	// 					}
	// 				});
	// 			}
	// 		}
	// 	});
	// }

	function attack(char) {
		return new Promise(function(resolve, reject) {
			var count = 0;
			for (var i = 0; i <= char.moves.length; i++) {
				console.log('This is your ', i);
				if (count === char.moves.length) {
					resolve(char);
				} else {
					console.log(char.moves[i]);
					console.log(i);
					client.get(char.moves[i], function(data, res) {
						if (data.power !== null) {
							console.log(data.name);
							console.log(char.moves.length);
							count++;
							console.log(count)
							char.attack[data.name] = data.power;
						}
					});
				}
			}
		});
	}

	function display(x) {
		var hp = x.hp
		var name = x.name;
		console.log(name);
		console.log(hp);
		console.log(x.attack);
	}


	function checkForGame() {
		if (pokemon1 && pokemon2) {
			console.log('HEY THERE ARE 2 POKEMON');
			battle(pokemon1, pokemon2);
		}
	}

	function battle(x, y) {

		var player1 = x;
		var player2 = y;
		var turn = 0;
		console.log("====================");
		console.log(x);
		console.log("====================");
		console.log(y);
		console.log("====================");
		// while (player1.hp > 0 && player2.hp >0) {
		// 	if (turn === 0) {
		// 		player2.hp = player2.h1 - player1.attack
		// 	}
		// 	if (turn === 1) {
		// 		console.log('player 2 turn');
		// 	}
		// }
	}



};