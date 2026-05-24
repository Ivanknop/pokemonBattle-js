const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const db = require('./db');

const csvPath = path.resolve(__dirname, '..', 'data', 'pokemon_estadisticas_pd.csv');

function seed() {
  console.log('Leyendo CSV...');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ',',
    relax_column_count: true,
  });

  const insert = db.prepare(`
    INSERT OR IGNORE INTO pokemon (name, type1, type2, attack, defense, sp_attack, sp_defense, speed, hp, total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((rows) => {
    for (const row of rows) {
      insert.run(
        row.name, row.type1, row.type2 || null,
        parseFloat(row.attack) || 0,
        parseFloat(row.defense) || 0,
        parseFloat(row.sp_attack) || 0,
        parseFloat(row.sp_defense) || 0,
        parseFloat(row.speed) || 0,
        parseFloat(row.hp) || 0,
        parseFloat(row.total) || 0
      );
    }
  });

  insertMany(records);
  const count = db.prepare('SELECT COUNT(*) as count FROM pokemon').get();
  console.log(`Seed completado: ${count.count} pokémon insertados`);
}

seed();
