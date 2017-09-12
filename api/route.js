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
		res.write('' + '\n');
		res.write('==========================' + '\n');
		res.write('' + '\n');
		res.write('Here are the route options' + '\n');
		res.write('==========================' + '\n');
		res.write('' + '\n');
		res.write('1) /overview/:id  (id MUST be a number below 365)' + '\n');
		res.write('[overview] will return a pokemon as an Object' + '\n');
		res.write('' + '\n');
		res.write('' + '\n');
		res.write('2) /attack/:id  (id MUST be a number below 622)' + '\n');
		res.write('[attack] will return an attack as an Object' + '\n');
		res.write('' + '\n');
		res.write('' + '\n');
		res.write('3) /battle/:pokemon1/:pokemon2  (pokemon1 & pokemon2 MUST be numbers & both parameters need to be fulfilled)' + '\n');
		res.write('[battle]will return the summary of 2 pokemon battling as an Object' + '\n');
		res.end();
	});

	//Route for an attack information from a single ID
	app.get('/attack/:id', function(req, res) {
		if (req.params.id > 622) {
			res.redirect('/');
		}

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
	app.get('/battle/:pokemon1/:pokemon2', function(req, res) {
		if (req.params.pokemon1 > 365 || req.params.pokemon2 > 365) {
			res.redirect('/');
		}
		var pokemonId1 = req.params.pokemon1;
		var pokemonId2 = req.params.pokemon2;
		if (isNaN(pokemonId1) === false && isNaN(pokemonId2) === false) {

			//Find pokemon and set object
			pokeMonSet(pokemonId1).then(function(data) {
				console.log('first');
				pokemon1 = data;
				//Set attacks and power hits to the object
				attackSet(pokemon1).then(function(data1) {
					battle(data1.attack).then(function(summary) {
						res.json({battle_summary: summary});
					});
				});
			});

			//Find pokemon and set object
			pokeMonSet(pokemonId2).then(function(data) {
				console.log('second');
				pokemon2 = data;
				//Set attacks and power hits to the object
				attackSet(pokemon2).then(function(data2) {
					battle(data2.attack).then(function(summary) {
						res.json({battle_summary: summary});
					});
				});
			});

		} else {
			res.redirect('/');
			console.log('you need 2 id numbers');
		}

	});

	app.get('/overview/:id', function(req, res) {
		//The ID must be a number
		if (req.params.id > 365) {
			res.redirect('/noPokemon');
		}
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

	// all other routes will pass here
	app.get("*", function(req, res) {
		console.log('No PokeMon found here....');
		res.send('No PokeMon found here....');
	});


	// functions to manage data
	//======================================================

	//Find a single PokeMon Over view.
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

	//Find a single attack
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

	//Set pokemon for battle. Promise is returned
	function pokeMonSet(idNum) {
		return new Promise(function(resolve, reject) {
			client.get('http://pokeapi.co/api/v2/pokemon/' + idNum + '/', function(data, res) {

				pokemonSet = {
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

				resolve(pokemonSet);
			});
		});
	}

	//Set Attack names and hit power to the pokemon Obj.
	function attackSet(char) {
		return new Promise(function(resolve, reject) {
			var count = 0;

			for (var i = 0; i < char.moves.length; i++) {
				client.get(char.moves[i], function(data, res) {
					// the last load is null so it stops here
					if (data.power !== null) {
						char.attack[data.name] = data.power;
						count++;
						if (count === char.moves.length) {
							resolve(char);
						}
					}
				});
			}
		});
	};

	//once 2 pokemon are set in this global script the function will fully run.
	function battle(attack) {
		return new Promise(function(resolve, reject) {


			if (pokemon1 && pokemon2) {
				var history = [];
				var sumHistory = {};

				var player1 = pokemon1;
				var player2 = pokemon2;

				var attack1 = Object.keys(pokemon1.attack);
				var attack2 = Object.keys(pokemon2.attack);

				if (attack1.length !== 0 && attack2.length !== 0) {
					var turn = 0;

					history.push('PokeMon #1 : ' + player1.name + ' with hp : ' + player1.hp + ' PokeMon #2 : ' + player2.name + ' with hp : ' + player2.hp);

					console.log(attack1);
					console.log(attack2);
					while (player1.hp >= 0 && player2.hp >= 0) {
						if (turn === 0) {
							var tempAttack = attack1[Math.floor(Math.random() * attack1.length)];
							var tempHit = player1.attack[tempAttack] * .10;
							if (tempAttack !== undefined) {
								player2.hp = player2.hp - tempHit;
								history.push(player1.name + " used " + tempAttack + " at " + tempHit + " hit power." );
								history.push(player2.name + ' hp is now ' + player2.hp);
								turn = 1;
							} else {
								history.push(player1.name + ' has missed');
							}
							turn = 1;
						}
						if (turn === 1) {
							var tempAttack = attack2[Math.floor(Math.random() * attack2.length)];
							var tempHit = player2.attack[tempAttack] * .10;
							if (tempAttack !== undefined) {
								player1.hp = player1.hp - tempHit;
								history.push(player2.name + " used " + tempAttack + " at " + tempHit + " hit power." );
								history.push(player1.name + ' hp is now ' + player1.hp);
							} else {
								history.push(player2.name + ' has missed');
							}
							turn = 0;
						}
					}

					if (player1.hp > player2.hp) {
						history.push('The WINNER : ' + player1.name);
					} else {
						history.push('The WINNER : ' + player2.name);
					}

					for (var i = 0; i < history.length; i++) {
						sumHistory[i + 1] = history[i];
					}

					//pokemon1 = undefined;
					//pokemon2 = undefined;
					pokemon1 = {};
					pokemon2 = {};

					resolve(sumHistory);
					console.log("END ++++++ END");
				}
			}
		});
	};
};
