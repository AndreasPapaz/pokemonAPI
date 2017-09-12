# PokeMon API Description

Using Node.js and Express, this api will give you: a quick over view of a Pokemon, a quick over view of an Attack, and a battle over view of 2 selected PokeMon.

### My PokeMon API
Use : https://andreas-pokemon.herokuapp.com/

or clone repo, npm install, npm start.

## Screenshots

Over View Route
![Image of Over View Route- Over View](https://i.imgur.com/m54iU96.png)

Attack Route
![Image of Over View Route- Over View](https://i.imgur.com/ZL4kga4.png)

Battle Route
![Image of Over View Route- Over View](https://i.imgur.com/Q1bJi5o.jpg)




```js
API Routes

/overview/:id //Will send JSON format of a PokeMon. the :id must be a number, If it is not, it will throw you back to the Home Route.

/attack/:id? //WWill send JSON format of an Attack. the :id must be a number, If it is not, it will throw you back to the Home Route.

/battle/:pokemon1/:pokemon2 //Will send JSON format of the battle history of 2 pokemon and the Winner. There are 2 parameters (1: pokemon1, 2: pokemon2) Both pokemon must use an id number.

All Other Routes will respond in No PokeMon Found Here....
```

## API and tools

| what            | where                                          |
|-----------------|------------------------------------------------|
| poke API        | https://pokeapi.co/                            |
| Node.js         | https://nodejs.org/en/                         |
| express.js      | https://expressjs.com/                         |
| body-parser     | https://www.npmjs.com/package/body-parser-json |
| node-rest-client| https://www.npmjs.com/package/node-rest-client |

