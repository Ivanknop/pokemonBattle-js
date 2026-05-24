const express = require('express');
const path = require('path');
const session = require('express-session');

const Pokemon = require('./models/Pokemon');
const Fight = require('./services/fight');
const { TypeChart, TYPE_CHART } = require('./services/TypeChart');
const CombatRules = require('./services/CombatRules');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const PAGE_SIZE = 36;

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, '..', 'views'));

app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'pokemon-secret',
  resave: false,
  saveUninitialized: false,
}));

function dbRowToPokemon(row) {
  return new Pokemon(
    row.name, row.type1, row.type2 || '',
    row.attack, row.defense, row.sp_attack, row.sp_defense,
    row.speed, row.hp, row.total,
  );
}

function pokemonToSession(p) {
  return {
    name: p.name,
    type1: p.type1,
    type2: p.type2,
    attack: p.attack,
    defense: p.defense,
    sp_attack: p.sp_attack,
    sp_defense: p.sp_defense,
    speed: p.speed,
    hp: p.hp,
    total: p.total,
  };
}

function pokemonFromSession(data) {
  return new Pokemon(
    data.name, data.type1, data.type2,
    data.attack, data.defense, data.sp_attack, data.sp_defense,
    data.speed, data.hp, data.total,
  );
}

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

app.post('/start-fight', (req, res) => {
  const playerName = req.body.player;
  const pokemonRow = Pokemon.findByName(playerName);
  if (!pokemonRow) return res.status(404).send(`Pokémon "${playerName}" no encontrado`);

  const rivalRow = Pokemon.randomExcluding(playerName);
  if (!rivalRow) return res.status(400).send('No hay rivales disponibles');

  const player = dbRowToPokemon(pokemonRow);
  const rival = dbRowToPokemon(rivalRow);

  req.session.fighterOne = pokemonToSession(player);
  req.session.fighterTwo = pokemonToSession(rival);
  req.session.events = [];
  req.session.finished = false;
  req.session.round = 0;
  req.session.winner = null;
  req.session.winnerRole = null;
  req.session.playerLuck = 0;
  req.session.opponentLuck = 0;
  req.session.pendingPlayerLuck = null;
  req.session.pendingOpponentLuck = null;
  req.session.luckUsedThisTurn = false;

  res.redirect('/fight');
});

app.get('/fight', (req, res) => {
  const fighterOne = req.session.fighterOne;
  const fighterTwo = req.session.fighterTwo;
  if (!fighterOne || !fighterTwo) return res.redirect('/choose');

  res.render('fight', {
    fighterOne,
    fighterTwo,
    events: req.session.events || [],
    finished: req.session.finished || false,
    round: req.session.round || 0,
    winner: req.session.winner,
    winnerRole: req.session.winnerRole,
    playerLuck: req.session.playerLuck || 0,
    opponentLuck: req.session.opponentLuck || 0,
    pendingPlayerLuck: req.session.pendingPlayerLuck,
    pendingOpponentLuck: req.session.pendingOpponentLuck,
    luckUsedThisTurn: req.session.luckUsedThisTurn || false,
  });
});

app.post('/fight/next', (req, res) => {
  const f1Data = req.session.fighterOne;
  const f2Data = req.session.fighterTwo;
  if (!f1Data || !f2Data) return res.redirect('/choose');

  const fighterOne = pokemonFromSession(f1Data);
  const fighterTwo = pokemonFromSession(f2Data);
  const battle = new Fight(fighterOne, fighterTwo);

  req.session.round = (req.session.round || 0) + 1;
  const playerLuck = parseInt(req.session.playerLuck || 0, 10);
  const opponentLuck = parseInt(req.session.opponentLuck || 0, 10);
  const result = battle.playTurn(playerLuck, opponentLuck);

  req.session.fighterOne = pokemonToSession(fighterOne);
  req.session.fighterTwo = pokemonToSession(fighterTwo);

  const events = req.session.events || [];
  for (let i = result.length - 1; i >= 0; i--) {
    events.unshift(result[i]);
  }
  req.session.events = events;

  const winner = battle.winner();
  if (winner !== null) {
    req.session.finished = true;
    req.session.winner = winner.get_name();
    req.session.winnerRole = winner.get_name() === fighterOne.get_name() ? 'Jugador' : 'Rival';
  }

  req.session.playerLuck = 0;
  req.session.opponentLuck = 0;
  req.session.pendingPlayerLuck = null;
  req.session.pendingOpponentLuck = null;
  req.session.luckUsedThisTurn = false;

  res.redirect('/fight');
});

app.post('/fight/luck', (req, res) => {
  const combatRules = new CombatRules(new TypeChart(TYPE_CHART));
  const luckPair = combatRules.rollLuckPair({
    randrange: (a, b) => Math.floor(Math.random() * (b - a)) + a,
  });

  req.session.pendingPlayerLuck = luckPair.playerLuck;
  req.session.pendingOpponentLuck = luckPair.opponentLuck;
  req.session.luckUsedThisTurn = true;

  res.redirect('/fight');
});

app.post('/fight/luck/accept', (req, res) => {
  req.session.playerLuck = req.session.pendingPlayerLuck || 0;
  req.session.opponentLuck = req.session.pendingOpponentLuck || 0;
  req.session.pendingPlayerLuck = null;
  req.session.pendingOpponentLuck = null;
  res.redirect('/fight');
});

app.post('/fight/luck/reject', (req, res) => {
  req.session.pendingPlayerLuck = null;
  req.session.pendingOpponentLuck = null;
  res.redirect('/fight');
});

app.get('/type-chart', (req, res) => {
  res.render('type_chart', {
    typeChart: TYPE_CHART,
    types: Object.keys(TYPE_CHART).sort(),
  });
});

app.use((req, res) => {
  res.status(404).render('index');
});

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
