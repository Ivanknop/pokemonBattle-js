const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
const Pokemon = require("./pokemon");

const dbPath = path.join(__dirname, "..", "..", "data", "pokemon.db");
let db;

function getDb() {
  if (!db) {
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
  }
  return db;
}

function initDatabase() {
  const conn = getDb();
  conn.exec(`
    CREATE TABLE IF NOT EXISTS pokemon (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      type1 TEXT NOT NULL,
      type2 TEXT,
      attack REAL NOT NULL,
      defense REAL NOT NULL,
      sp_attack REAL NOT NULL,
      sp_defense REAL NOT NULL,
      speed REAL NOT NULL,
      hp REAL NOT NULL,
      total REAL NOT NULL
    )
  `);

  const row = conn.prepare("SELECT COUNT(*) as cnt FROM pokemon").get();
  if (row.cnt === 0) {
    seedFromCsv();
  }
}

function seedFromCsv() {
  const csvPath = path.join(__dirname, "..", "..", "scripts", "pokemon_estadisticas_pd.csv");
  const content = fs.readFileSync(csvPath, "utf-8");
  const lines = content.trim().split("\n");
  const headers = lines[0].trim().split(",");

  const nameIdx = headers.indexOf("name");
  const type1Idx = headers.indexOf("type1");
  const type2Idx = headers.indexOf("type2");
  const totalIdx = headers.indexOf("total");
  const hpIdx = headers.indexOf("hp");
  const attackIdx = headers.indexOf("attack");
  const defenseIdx = headers.indexOf("defense");
  const spAttackIdx = headers.indexOf("sp_attack");
  const spDefenseIdx = headers.indexOf("sp_defense");
  const speedIdx = headers.indexOf("speed");

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].trim().split(",");
    insertPokemon(
      cols[nameIdx],
      cols[type1Idx],
      cols[type2Idx] || null,
      parseFloat(cols[attackIdx]),
      parseFloat(cols[defenseIdx]),
      parseFloat(cols[spAttackIdx]),
      parseFloat(cols[spDefenseIdx]),
      parseFloat(cols[speedIdx]),
      parseFloat(cols[hpIdx]),
      parseFloat(cols[totalIdx])
    );
  }
}

function insertPokemon(name, type1, type2, attack, defense, sp_attack, sp_defense, speed, hp, total) {
  const conn = getDb();
  const stmt = conn.prepare(`
    INSERT OR IGNORE INTO pokemon (name, type1, type2, attack, defense, sp_attack, sp_defense, speed, hp, total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(name, type1, type2, attack, defense, sp_attack, sp_defense, speed, hp, total);
}

function _toDomain(row) {
  if (!row) return null;
  const characteristics = {
    type1: row.type1,
    type2: row.type2,
    attack: row.attack,
    defense: row.defense,
    sp_attack: row.sp_attack,
    sp_defense: row.sp_defense,
    speed: row.speed,
    total: row.total,
  };
  return new Pokemon(row.name, row.hp, characteristics);
}

function showEntities(limit = 0, offset = 0) {
  const conn = getDb();
  let query = "SELECT * FROM pokemon ORDER BY name ASC";
  const params = [];
  if (limit > 0) {
    query += " LIMIT ?";
    params.push(limit);
    if (offset > 0) {
      query += " OFFSET ?";
      params.push(offset);
    }
  }
  const rows = conn.prepare(query).all(...params);
  return rows.map(_toDomain);
}

function findEntity(name) {
  const conn = getDb();
  const row = conn.prepare("SELECT * FROM pokemon WHERE name = ?").get(name);
  return _toDomain(row);
}

function randomEntityExcluding(name) {
  const conn = getDb();
  const rows = conn.prepare("SELECT * FROM pokemon WHERE name != ?").all(name);
  if (rows.length === 0) return null;
  const row = rows[Math.floor(Math.random() * rows.length)];
  return _toDomain(row);
}

module.exports = {
  initDatabase,
  insertPokemon,
  showEntities,
  findEntity,
  randomEntityExcluding,
};
