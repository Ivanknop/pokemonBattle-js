const express = require('express');
const path = require('path');
const Pokemon = require('./models/Pokemon');
const Fight = require('./services/fight');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const PAGE_SIZE = 36;

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, '..', 'views'));

app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/characters', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * PAGE_SIZE;
  const pokemons = Pokemon.findAll(PAGE_SIZE, offset);
  const total = Pokemon.count();
  const totalPages = Math.ceil(total / PAGE_SIZE);
  res.render('characters', {
    data: pokemons, page, totalPages,
    hasPrev: page > 1, hasNext: page < totalPages,
    prevPage: page - 1, nextPage: page + 1,
  });
});

app.get('/choose', (req, res) => {
  res.render('choose_character', { pokemonDb: Pokemon.findAll() });
});

app.get('/fight', (req, res) => {
  const playerName = req.query.player;
  const pokemonRow = Pokemon.findByName(playerName);
  if (!pokemonRow) return res.status(404).send(`Pokémon "${playerName}" no encontrado`);

  const rivalRow = Pokemon.randomExcluding(playerName);
  if (!rivalRow) return res.status(400).send('No hay rivales disponibles');

  res.render('fight', {
    player: pokemonRow,
    rival: rivalRow,
    playerData: JSON.stringify(pokemonRow),
    rivalData: JSON.stringify(rivalRow),
  });
});

app.get('/fight/random', (req, res) => {
  const all = Pokemon.findAll();
  if (all.length < 2) return res.status(400).send('Se necesitan al menos 2 pokémon');
  const shuffled = all.sort(() => Math.random() - 0.5);
  res.render('fight', {
    player: shuffled[0], rival: shuffled[1],
    playerData: JSON.stringify(shuffled[0]),
    rivalData: JSON.stringify(shuffled[1]),
  });
});

app.get('/type-chart', (req, res) => {
  const TYPE_CHART = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
    fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
    poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
    ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
    flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
    rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
    ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
    steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
    fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
  };
  res.render('type_chart', {
    typeChart: TYPE_CHART,
    types: Object.keys(TYPE_CHART).sort(),
  });
});

app.use((req, res) => {
  res.status(404).render('index');
});

// Auto-seed on first run (important for Render ephemeral storage)
const db = require('./db');
const row = db.prepare('SELECT COUNT(*) as count FROM pokemon').get();
if (row.count === 0) {
  console.log('Base de datos vacía, ejecutando seed...');
  require('./seed');
}

app.listen(PORT, () => {
  console.log(`Pokémon Battle corriendo en http://localhost:${PORT}`);
});

module.exports = app;
