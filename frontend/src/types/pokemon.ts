export interface PokemonData {
  name: string;
  type1: string;
  type2?: string;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  hp: number;
  total: number;
}

export interface BattleState {
  id: string;
  fighterOne: PokemonData;
  fighterTwo: PokemonData;
  events: string[];
  finished: boolean;
  winner: string | null;
  winnerRole: string | null;
  playerLuck: number;
  opponentLuck: number;
  pendingPlayerLuck: number | null;
  pendingOpponentLuck: number | null;
  luckUsedThisTurn: boolean;
}
