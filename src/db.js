const path = require('path');
const Database = require('better-sqlite3');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, '..', 'data', 'pokemon.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS pokemon (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type1 TEXT NOT NULL,
    type2 TEXT,
    attack REAL NOT NULL DEFAULT 0,
    defense REAL NOT NULL DEFAULT 0,
    sp_attack REAL NOT NULL DEFAULT 0,
    sp_defense REAL NOT NULL DEFAULT 0,
    speed REAL NOT NULL DEFAULT 0,
    hp REAL NOT NULL DEFAULT 0,
    total REAL NOT NULL DEFAULT 0
  )
`);

module.exports = db;
