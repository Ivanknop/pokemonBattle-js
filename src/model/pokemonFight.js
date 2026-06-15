const Fight = require("../core/fight");
const PokemonCombatRules = require("./pokemonCombatRules");
const TypeChart = require("./typeChart");

class PokemonFight extends Fight {
  constructor(fighterOne, fighterTwo, rng = null) {
    super(fighterOne, fighterTwo, new PokemonCombatRules(new TypeChart()), rng);
  }

  turnText(attacker, defender, damage, attackerLuck, defenderLuck, defenderInitialVitality) {
    const attackerName = attacker.getName();
    const defenderName = defender.getName();
    const rules = this.getCombatRules();

    if (rules.isAutomaticFailure(attackerLuck)) {
      return `${attackerName} falló`;
    }

    if (rules.isBlocked(attacker, defender, attackerLuck, defenderLuck)) {
      return `${defenderName} bloqueó a ${attackerName} y solo recibió ${damage} de daño`;
    }

    if (rules.criticalMultiplier(attacker, defender, attackerLuck, defenderLuck) > 1) {
      return `${attackerName} ha dado un crítico dañando por ${damage} a ${defenderName}`;
    }

    if (defenderInitialVitality <= 0) {
      return `${attackerName} ha dado un buen golpe por ${damage} a ${defenderName}`;
    }

    const damageRatio = damage / defenderInitialVitality;

    if (damageRatio > 0.5) {
      return `${attackerName} dio un duro golpe de ${damage} a ${defenderName}`;
    }

    if (damageRatio < 0.1) {
      return `${attackerName} golpeó suavemente y solo le hizo ${damage} a ${defenderName}`;
    }

    return `${attackerName} ha dado un buen golpe por ${damage} a ${defenderName}`;
  }
}

module.exports = PokemonFight;
