const CombatRules = require("../core/combatRules");

class PokemonCombatRules extends CombatRules {
  constructor(typeChart) {
    super();
    this.typeChart = typeChart;
  }

  calculateBaseDamage(attacker, defender) {
    const typeMultiplier = this.typeChart.multiplierFor(attacker, defender);
    if (typeMultiplier === 0) return 0;
    const rawDamage = attacker.offensivePower() - defender.defensivePower();
    return Math.max(1, rawDamage * typeMultiplier);
  }

  calculateTurnDamage(attacker, defender, attackerLuck, defenderLuck) {
    if (this.isAutomaticFailure(attackerLuck)) return 0;
    const damage = this.calculateBaseDamage(attacker, defender);
    if (damage === 0) return 0;
    if (this.isBlocked(attacker, defender, attackerLuck, defenderLuck)) return 1;
    const finalDamage = damage * this.criticalMultiplier(attacker, defender, attackerLuck, defenderLuck);
    return Math.max(1, Math.round(finalDamage * 100) / 100);
  }
}

module.exports = PokemonCombatRules;
