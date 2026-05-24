import { TypeChart, TYPE_CHART } from "./TypeChart";
import { Pokemon } from "./Pokemon";

export class CombatRules {
  private typeChart: TypeChart;

  constructor(typeChart?: TypeChart) {
    this.typeChart = typeChart ?? new TypeChart(TYPE_CHART);
  }

  calculateBaseDamage(attacker: Pokemon, defender: Pokemon): number {
    const typeMultiplier = this.typeChart.multiplierFor(attacker, defender);
    if (typeMultiplier === 0) return 0;
    const offensivePower = attacker.attack * 0.6 + attacker.spAttack * 0.4;
    const defensivePower = defender.defense * 0.5 + defender.spDefense * 0.3;
    const rawDamage = offensivePower - defensivePower;
    return Math.max(1, rawDamage * typeMultiplier);
  }

  calculateTurnDamage(
    attacker: Pokemon,
    defender: Pokemon,
    attackerLuck: number,
    defenderLuck: number
  ): number {
    if (this.isAutomaticFailure(attackerLuck)) return 0;
    const damage = this.calculateBaseDamage(attacker, defender);
    if (damage === 0) return 0;
    if (this.isBlocked(attacker, defender, attackerLuck, defenderLuck)) return 1;
    const finalDamage =
      damage * this.criticalMultiplier(attacker, defender, attackerLuck, defenderLuck);
    return Math.max(1, Math.round(finalDamage * 100) / 100);
  }

  initiativeScore(pokemon: Pokemon, pokemonLuck: number): number {
    return pokemon.speed + pokemonLuck;
  }

  modifiedSpeed(pokemon: Pokemon, pokemonLuck: number): number {
    return pokemon.speed + pokemonLuck;
  }

  isAutomaticFailure(pokemonLuck: number): boolean {
    return pokemonLuck === 1;
  }

  isAutomaticSuccess(pokemonLuck: number): boolean {
    return pokemonLuck === 100;
  }

  isBlocked(
    attacker: Pokemon,
    defender: Pokemon,
    attackerLuck: number,
    defenderLuck: number
  ): boolean {
    if (this.isAutomaticFailure(attackerLuck)) return false;
    if (this.isAutomaticSuccess(attackerLuck)) return false;
    const attackerSpeed = this.modifiedSpeed(attacker, attackerLuck);
    const defenderSpeed = this.modifiedSpeed(defender, defenderLuck);
    return defenderSpeed >= attackerSpeed * 2;
  }

  isCriticalHit(
    attacker: Pokemon,
    defender: Pokemon,
    attackerLuck: number,
    defenderLuck: number
  ): boolean {
    if (this.isAutomaticFailure(attackerLuck)) return false;
    if (this.isAutomaticSuccess(attackerLuck)) return true;
    const attackerSpeed = this.modifiedSpeed(attacker, attackerLuck);
    const defenderSpeed = this.modifiedSpeed(defender, defenderLuck);
    return attackerSpeed >= defenderSpeed * 2;
  }

  criticalMultiplier(
    attacker: Pokemon,
    defender: Pokemon,
    attackerLuck: number,
    defenderLuck: number
  ): number {
    if (this.isAutomaticSuccess(attackerLuck)) return 3;
    if (this.isCriticalHit(attacker, defender, attackerLuck, defenderLuck)) return 2;
    return 1;
  }

  rollLuckPair(rng: () => number): { playerLuck: number; opponentLuck: number } {
    return {
      playerLuck: Math.floor(rng() * 100) + 1,
      opponentLuck: Math.floor(rng() * 100) + 1,
    };
  }
}
