const { TypeChart, TYPE_CHART } = require('./TypeChart');

class CombatRules {
  constructor(typeChart) {
    this.typeChart = typeChart;
  }

  calculateBaseDamage(attacker, defender) {
    const typeMultiplier = this.typeChart.multiplierFor(attacker, defender);
    if (typeMultiplier === 0) return 0;
    const offensivePower = attacker.attack * 0.6 + attacker.sp_attack * 0.4;
    const defensivePower = defender.defense * 0.5 + defender.sp_defense * 0.3;
    const rawDamage = offensivePower - defensivePower;
    return Math.max(1, rawDamage * typeMultiplier);
  }

  calculateTurnDamage(attacker, defender, attackerLuck, defenderLuck) {
    if (this.isAutomaticFailure(attackerLuck)) return 0;
    let damage = this.calculateBaseDamage(attacker, defender);
    if (damage === 0) return 0;
    if (this.isBlocked(attacker, defender, attackerLuck, defenderLuck)) return 1;
    damage = damage * this.criticalMultiplier(attacker, defender, attackerLuck, defenderLuck);
    return Math.max(1, Math.round(damage * 100) / 100);
  }

  initiativeScore(pokemon, pokemonLuck) {
    return pokemon.speed + pokemonLuck;
  }

  modifiedSpeed(pokemon, pokemonLuck) {
    return pokemon.speed + pokemonLuck;
  }

  isAutomaticFailure(pokemonLuck) {
    return pokemonLuck === 1;
  }

  isAutomaticSuccess(pokemonLuck) {
    return pokemonLuck === 100;
  }

  isBlocked(attacker, defender, attackerLuck, defenderLuck) {
    if (this.isAutomaticFailure(attackerLuck)) return false;
    if (this.isAutomaticSuccess(attackerLuck)) return false;
    const attackerSpeed = this.modifiedSpeed(attacker, attackerLuck);
    const defenderSpeed = this.modifiedSpeed(defender, defenderLuck);
    return defenderSpeed >= attackerSpeed * 2;
  }

  isCriticalHit(attacker, defender, attackerLuck, defenderLuck) {
    if (this.isAutomaticFailure(attackerLuck)) return false;
    if (this.isAutomaticSuccess(attackerLuck)) return true;
    const attackerSpeed = this.modifiedSpeed(attacker, attackerLuck);
    const defenderSpeed = this.modifiedSpeed(defender, defenderLuck);
    return attackerSpeed >= defenderSpeed * 2;
  }

  criticalMultiplier(attacker, defender, attackerLuck, defenderLuck) {
    if (this.isAutomaticSuccess(attackerLuck)) return 3;
    if (this.isCriticalHit(attacker, defender, attackerLuck, defenderLuck)) return 2;
    return 1;
  }

  rollLuckPair(rng) {
    return {
      playerLuck: rng.randrange(1, 101),
      opponentLuck: rng.randrange(1, 101),
    };
  }
}

module.exports = CombatRules;
