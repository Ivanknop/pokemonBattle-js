const { TypeChart, TYPE_CHART } = require('./TypeChart');
const CombatRules = require('./CombatRules');

class Fight {
  constructor(fighterOne, fighterTwo, combatRules, rng) {
    this._fighterOne = fighterOne;
    this._fighterTwo = fighterTwo;
    this._rng = rng || { randrange: (a, b) => Math.floor(Math.random() * (b - a)) + a };
    this._combatRules = combatRules || new CombatRules(new TypeChart(TYPE_CHART));
  }

  getFighterOne() { return this._fighterOne; }
  getFighterTwo() { return this._fighterTwo; }
  getCombatRules() { return this._combatRules; }

  orderToHit(playerLuck, opponentLuck) {
    const f1Initiative = this._combatRules.initiativeScore(this.getFighterOne(), playerLuck);
    const f2Initiative = this._combatRules.initiativeScore(this.getFighterTwo(), opponentLuck);
    if (f1Initiative >= f2Initiative) {
      return [this.getFighterOne(), this.getFighterTwo()];
    }
    return [this.getFighterTwo(), this.getFighterOne()];
  }

  playTurn(playerLuck, opponentLuck) {
    playerLuck = parseInt(playerLuck, 10);
    opponentLuck = parseInt(opponentLuck, 10);

    if (!this.bothFightersAreAlive()) {
      const w = this.winner();
      if (w === null) return ['La batalla terminó sin vencedor.'];
      return ['La batalla ya terminó. Vencedor ' + w.get_name()];
    }

    const [firstAttacker, secondAttacker] = this.orderToHit(playerLuck, opponentLuck);
    const events = [];
    events.push(this.attackOnce(firstAttacker, secondAttacker, playerLuck, opponentLuck));
    if (secondAttacker.isAlive()) {
      events.push(this.attackOnce(secondAttacker, firstAttacker, playerLuck, opponentLuck));
    }
    return events;
  }

  bothFightersAreAlive() {
    return this.getFighterTwo().isAlive() && this.getFighterOne().isAlive();
  }

  winner() {
    if (this._fighterOne.isAlive() && !this._fighterTwo.isAlive()) return this._fighterOne;
    if (this._fighterTwo.isAlive() && !this._fighterOne.isAlive()) return this._fighterTwo;
    return null;
  }

  attackOnce(attacker, defender, playerLuck, opponentLuck) {
    const [attackerLuck, defenderLuck] = this.luckFor(attacker, defender, playerLuck, opponentLuck);
    const defenderInitialHp = defender.getHp();
    const damage = this._combatRules.calculateTurnDamage(attacker, defender, attackerLuck, defenderLuck);
    if (damage > 0) defender.takeHit(damage);
    return this.turnText(attacker, defender, damage, attackerLuck, defenderLuck, defenderInitialHp);
  }

  luckFor(attacker, defender, playerLuck, opponentLuck) {
    if (attacker === this._fighterOne) return [playerLuck, opponentLuck];
    return [opponentLuck, playerLuck];
  }

  turnText(attacker, defender, damage, attackerLuck, defenderLuck, defenderInitialHp) {
    const attackerName = attacker.get_name();
    const defenderName = defender.get_name();

    if (this._combatRules.isAutomaticFailure(attackerLuck)) {
      return `${attackerName} falló`;
    }
    if (this._combatRules.isBlocked(attacker, defender, attackerLuck, defenderLuck)) {
      return `${defenderName} bloqueó a ${attackerName} y solo recibió ${damage} de daño`;
    }
    if (this._combatRules.criticalMultiplier(attacker, defender, attackerLuck, defenderLuck) > 1) {
      return `${attackerName} ha dado un crítico dañando por ${damage} a ${defenderName}`;
    }
    if (defenderInitialHp <= 0) {
      return `${attackerName} ha dado un buen golpe por ${damage} a ${defenderName}`;
    }
    const damageRatio = damage / defenderInitialHp;
    if (damageRatio > 0.5) {
      return `${attackerName} dio un duro golpe de ${damage} a ${defenderName}`;
    }
    if (damageRatio < 0.1) {
      return `${attackerName} golpeó suavemente y solo le hizo ${damage} a ${defenderName}`;
    }
    return `${attackerName} ha dado un buen golpe por ${damage} a ${defenderName}`;
  }
}

module.exports = Fight;
