class Fight {
  constructor(fighterOne, fighterTwo) {
    this.fighterOne = fighterOne;
    this.fighterTwo = fighterTwo;
  }

  /**
   * SIMULTANEOUS COMBAT — both pokemon attack each round.
   * Includes type effectiveness, dodge, block, and critical hits.
   */
  fight() {
    const hitList = [];
    let round = 0;
    const maxRounds = 100;

    while (this.fighterOne.isAlive() && this.fighterTwo.isAlive() && round < maxRounds) {
      round++;
      const roundEvents = [];

      this.resolveAttack(this.fighterOne, this.fighterTwo, roundEvents);

      if (this.fighterTwo.isAlive()) {
        this.resolveAttack(this.fighterTwo, this.fighterOne, roundEvents);
      }

      roundEvents.forEach((e) => hitList.push(e));
    }

    const winner = this.fighterOne.isAlive() ? this.fighterOne : this.fighterTwo;
    hitList.push(`🏆 La batalla ha terminado. ¡Vencedor: ${winner.name}!`);
    return hitList;
  }

  resolveAttack(attacker, defender, events) {
    const typeChart = getTypeChart();

    // Type effectiveness
    const typeMult = typeMultiplier(typeChart, attacker.type1, defender.type1, defender.type2);

    // Dodge chance (based on speed difference)
    const dodgeChance = Math.max(0, (defender.speed - attacker.speed) / 500);
    if (Math.random() < dodgeChance) {
      events.push(defender.dodgeText());
      return;
    }

    // Hit roll
    const atkRoll = attacker.speed * 0.3 + attacker.attack * 0.4 + Math.random() * 30;
    const defRoll = defender.speed * 0.4 + defender.defense * 0.3 + Math.random() * 30;

    if (atkRoll < defRoll) {
      events.push(attacker.bloqText());
      return;
    }

    // Damage
    const offensive = attacker.attack * 0.6 + attacker.sp_attack * 0.4;
    const defensive = defender.defense * 0.5 + defender.sp_defense * 0.3;
    let damage = Math.max(1, Math.round((offensive - defensive) * typeMult));

    // Block (defender much faster)
    if (defender.speed >= attacker.speed * 1.5 && Math.random() < 0.3) {
      damage = Math.max(1, Math.round(damage * 0.25));
      events.push(`${defender.name} bloqueó parcialmente el ataque, recibiendo solo ${damage} de daño`);
      defender.takeHit(damage);
      return;
    }

    // Critical hit
    const critChance = 0.05 + (attacker.speed - defender.speed) / 1000;
    if (Math.random() < Math.max(0.01, critChance)) {
      damage = Math.round(damage * 2);
      events.push(attacker.critText(damage));
    } else {
      events.push(attacker.hitText(damage));
    }

    defender.takeHit(damage);
  }
}

function typeMultiplier(chart, attackType, defType1, defType2) {
  let mult = chart[attackType.toLowerCase()]?.[defType1.toLowerCase()] ?? 1;
  if (defType2 && defType2 !== '') {
    mult *= chart[attackType.toLowerCase()]?.[defType2.toLowerCase()] ?? 1;
  }
  return mult;
}

function getTypeChart() {
  return {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
    fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
    poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
    ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
    flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
    rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
    ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
    steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
    fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
  };
}

module.exports = Fight;
