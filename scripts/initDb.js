const fs = require("fs");
const path = require("path");
const { initDatabase, insertPokemon } = require("../src/model/handlerData");

const csvPath = path.join(__dirname, "pokemon_estadisticas_pd.csv");

function fill() {
  const content = fs.readFileSync(csvPath, "utf-8");
  const lines = content.trim().split("\n");
  const headers = lines[0].split(",");

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

initDatabase();
fill();
console.log("Base de datos creada y cargada correctamente.");
