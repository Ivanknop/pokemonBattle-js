import { Fight } from "./models/Fight";
import { Pokemon } from "./models/Pokemon";

interface BattleSession {
  id: string;
  fight: Fight;
  events: string[];
  finished: boolean;
  winner: string | null;
  winnerRole: string | null;
  playerLuck: number;
  opponentLuck: number;
  pendingPlayerLuck: number | null;
  pendingOpponentLuck: number | null;
  luckUsedThisTurn: boolean;
  fighterOneData: Pokemon;
  fighterTwoData: Pokemon;
}

const battles = new Map<string, BattleSession>();

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function createBattle(fighterOne: Pokemon, fighterTwo: Pokemon): string {
  const id = generateId();
  const fight = new Fight(fighterOne, fighterTwo);
  battles.set(id, {
    id,
    fight,
    events: [],
    finished: false,
    winner: null,
    winnerRole: null,
    playerLuck: 0,
    opponentLuck: 0,
    pendingPlayerLuck: null,
    pendingOpponentLuck: null,
    luckUsedThisTurn: false,
    fighterOneData: fighterOne,
    fighterTwoData: fighterTwo,
  });
  return id;
}

export function getBattle(id: string): BattleSession | undefined {
  return battles.get(id);
}

export { BattleSession };
