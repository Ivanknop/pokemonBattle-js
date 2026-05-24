import { CombatRules } from "./CombatRules";
import { Pokemon } from "./Pokemon";

export class Fight {
  private fighterOne: Pokemon;
  private fighterTwo: Pokemon;

  constructor(fighterOne: Pokemon, fighterTwo: Pokemon) {
    this.fighterOne = fighterOne;
    this.fighterTwo = fighterTwo;
  }

  getFighterOne(): Pokemon {
    return this.fighterOne;
  }

  getFighterTwo(): Pokemon {
    return this.fighterTwo;
  }

  private orderToHit(playerLuck = 0, opponentLuck = 0): [Pokemon, Pokemon] {
    const rules = new CombatRules();
    const f1Init = rules.initiativeScore(this.fighterOne, playerLuck);
    const f2Init = rules.initiativeScore(this.fighterTwo, opponentLuck);
    if (f1Init >= f2Init) return [this.fighterOne, this.fighterTwo];
    return [this.fighterTwo, this.fighterOne];
  }

  bothFightersAreAlive(): boolean {
    return this.fighterOne.isAlive() && this.fighterTwo.isAlive();
  }

  winner(): Pokemon | null {
    if (this.fighterOne.isAlive() && !this.fighterTwo.isAlive()) return this.fighterOne;
    if (this.fighterTwo.isAlive() && !this.fighterOne.isAlive()) return this.fighterTwo;
    return null;
  }

  playTurn(playerLuck = 0, opponentLuck = 0): string[] {
    if (!this.bothFightersAreAlive()) {
      const w = this.winner();
      if (w === null) return ["La batalla terminó sin vencedor."];
      return ["La batalla ya terminó. Vencedor " + w.name];
    }

    const [first, second] = this.orderToHit(playerLuck, opponentLuck);
    const events: string[] = [];
    events.push(this.attackOnce(first, second, playerLuck, opponentLuck));
    if (second.isAlive()) {
      events.push(this.attackOnce(second, first, playerLuck, opponentLuck));
    }
    return events;
  }

  private attackOnce(
    attacker: Pokemon,
    defender: Pokemon,
    playerLuck: number,
    opponentLuck: number
  ): string {
    const [attackerLuck, defenderLuck] = this.luckFor(attacker, defender, playerLuck, opponentLuck);
    const defenderInitialHp = defender.getHp();
    const rules = new CombatRules();
    const damage = rules.calculateTurnDamage(attacker, defender, attackerLuck, defenderLuck);
    if (damage > 0) {
      defender.takeHit(damage);
    }
    return this.turnText(attacker, defender, damage, attackerLuck, defenderLuck, defenderInitialHp);
  }

  private luckFor(
    attacker: Pokemon,
    defender: Pokemon,
    playerLuck: number,
    opponentLuck: number
  ): [number, number] {
    if (attacker === this.fighterOne) return [playerLuck, opponentLuck];
    return [opponentLuck, playerLuck];
  }

  private turnText(
    attacker: Pokemon,
    defender: Pokemon,
    damage: number,
    attackerLuck: number,
    defenderLuck: number,
    defenderInitialHp: number
  ): string {
    const rules = new CombatRules();
    const attackerName = attacker.name;
    const defenderName = defender.name;

    if (rules.isAutomaticFailure(attackerLuck)) return `${attackerName} falló`;
    if (rules.isBlocked(attacker, defender, attackerLuck, defenderLuck)) {
      return `${defenderName} bloqueó a ${attackerName} y solo recibió ${damage} de daño`;
    }
    if (rules.criticalMultiplier(attacker, defender, attackerLuck, defenderLuck) > 1) {
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
