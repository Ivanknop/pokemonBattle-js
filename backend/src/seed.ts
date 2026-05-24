import { createReadStream } from "fs";
import { join } from "path";
import { parse } from "csv-parse";
import prisma from "./db";

interface CsvRow {
  name: string;
  type1: string;
  type2: string;
  attack: string;
  defense: string;
  sp_attack: string;
  sp_defense: string;
  speed: string;
  hp: string;
  total: string;
}

async function seed() {
  const csvPath = join(__dirname, "..", "data", "pokemon_estadisticas_pd.csv");
  const records: CsvRow[] = [];

  const parser = createReadStream(csvPath).pipe(
    parse({ columns: true, encoding: "utf8" })
  );

  for await (const record of parser) {
    records.push(record as CsvRow);
  }

  for (const row of records) {
    await prisma.pokemon.create({
      data: {
        name: row.name,
        type1: row.type1,
        type2: row.type2 || null,
        attack: parseFloat(row.attack),
        defense: parseFloat(row.defense),
        spAttack: parseFloat(row.sp_attack),
        spDefense: parseFloat(row.sp_defense),
        speed: parseFloat(row.speed),
        hp: parseFloat(row.hp),
        total: parseFloat(row.total),
      },
    });
  }

  console.log(`Seeded ${records.length} Pokemon.`);
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
