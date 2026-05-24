import { Router, Request, Response } from "express";
import { Pokemon } from "../models/Pokemon";
import { CombatRules } from "../models/CombatRules";
import { createBattle, getBattle } from "../battleStore";
import prisma from "../db";

const router = Router();

function pokemonFromDb(dbRow: {
  name: string;
  type1: string;
  type2: string | null;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  hp: number;
  total: number;
}): Pokemon {
  return new Pokemon({
    name: dbRow.name,
    type1: dbRow.type1,
    type2: dbRow.type2 ?? undefined,
    attack: dbRow.attack,
    defense: dbRow.defense,
    spAttack: dbRow.spAttack,
    spDefense: dbRow.spDefense,
    speed: dbRow.speed,
    hp: dbRow.hp,
    total: dbRow.total,
  });
}

router.post("/start", async (req: Request, res: Response) => {
  try {
    const { playerName } = req.body;
    if (!playerName) {
      res.status(400).json({ error: "playerName is required" });
      return;
    }
    const playerDb = await prisma.pokemon.findUnique({ where: { name: playerName } });
    if (!playerDb) {
      res.status(404).json({ error: "Pokemon not found" });
      return;
    }

    const allOthers = await prisma.pokemon.findMany({
      where: { name: { not: playerName } },
    });
    if (allOthers.length === 0) {
      res.status(400).json({ error: "No opponents available" });
      return;
    }
    const opponentDb = allOthers[Math.floor(Math.random() * allOthers.length)];

    const playerPokemon = pokemonFromDb(playerDb);
    const opponentPokemon = pokemonFromDb(opponentDb);
    const battleId = createBattle(playerPokemon, opponentPokemon);

    res.json({
      battleId,
      fighterOne: playerPokemon.getCharacteristics(),
      fighterTwo: opponentPokemon.getCharacteristics(),
    });
  } catch (error) {
    res.status(500).json({ error: "Error starting fight" });
  }
});

router.get("/:id", (req: Request, res: Response) => {
  const battle = getBattle(req.params.id);
  if (!battle) {
    res.status(404).json({ error: "Battle not found" });
    return;
  }
  res.json({
    id: battle.id,
    fighterOne: battle.fighterOneData.getCharacteristics(),
    fighterTwo: battle.fighterTwoData.getCharacteristics(),
    events: battle.events,
    finished: battle.finished,
    winner: battle.winner,
    winnerRole: battle.winnerRole,
    playerLuck: battle.playerLuck,
    opponentLuck: battle.opponentLuck,
    pendingPlayerLuck: battle.pendingPlayerLuck,
    pendingOpponentLuck: battle.pendingOpponentLuck,
    luckUsedThisTurn: battle.luckUsedThisTurn,
  });
});

router.post("/:id/turn", (req: Request, res: Response) => {
  const battle = getBattle(req.params.id);
  if (!battle) {
    res.status(404).json({ error: "Battle not found" });
    return;
  }
  const result = battle.fight.playTurn(battle.playerLuck, battle.opponentLuck);
  for (const event of result.reverse()) {
    battle.events.unshift(event);
  }
  const winner = battle.fight.winner();
  if (winner) {
    battle.finished = true;
    battle.winner = winner.name;
    battle.winnerRole = winner.name === battle.fighterOneData.name ? "Jugador" : "Rival";
  }
  battle.playerLuck = 0;
  battle.opponentLuck = 0;
  battle.pendingPlayerLuck = null;
  battle.pendingOpponentLuck = null;
  battle.luckUsedThisTurn = false;

  res.json({
    events: battle.events,
    finished: battle.finished,
    winner: battle.winner,
    winnerRole: battle.winnerRole,
    fighterOne: battle.fighterOneData.getCharacteristics(),
    fighterTwo: battle.fighterTwoData.getCharacteristics(),
  });
});

router.post("/:id/luck", (req: Request, res: Response) => {
  const battle = getBattle(req.params.id);
  if (!battle) {
    res.status(404).json({ error: "Battle not found" });
    return;
  }
  const rules = new CombatRules();
  const pair = rules.rollLuckPair(Math.random);
  battle.pendingPlayerLuck = pair.playerLuck;
  battle.pendingOpponentLuck = pair.opponentLuck;
  battle.luckUsedThisTurn = true;
  res.json({
    pendingPlayerLuck: battle.pendingPlayerLuck,
    pendingOpponentLuck: battle.pendingOpponentLuck,
  });
});

router.post("/:id/luck/accept", (req: Request, res: Response) => {
  const battle = getBattle(req.params.id);
  if (!battle) {
    res.status(404).json({ error: "Battle not found" });
    return;
  }
  battle.playerLuck = battle.pendingPlayerLuck ?? 0;
  battle.opponentLuck = battle.pendingOpponentLuck ?? 0;
  battle.pendingPlayerLuck = null;
  battle.pendingOpponentLuck = null;
  res.json({ playerLuck: battle.playerLuck, opponentLuck: battle.opponentLuck });
});

router.post("/:id/luck/reject", (req: Request, res: Response) => {
  const battle = getBattle(req.params.id);
  if (!battle) {
    res.status(404).json({ error: "Battle not found" });
    return;
  }
  battle.pendingPlayerLuck = null;
  battle.pendingOpponentLuck = null;
  res.json({ playerLuck: battle.playerLuck, opponentLuck: battle.opponentLuck });
});

export default router;
