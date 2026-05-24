const db = require('../db');

class Pokemon {
  constructor(name, type1, type2, attack, defense, sp_attack, sp_defense, speed, hp, total) {
    this.name = name;
    this.type1 = type1;
    this.type2 = type2 || '';
    this.attack = attack;
    this.defense = defense;
    this.sp_attack = sp_attack;
    this.sp_defense = sp_defense;
    this.speed = speed;
    this.hp = hp;
    this.total = total;
  }

  getCharacteristics() {
    return {
      name: this.name, type1: this.type1, type2: this.type2,
      attack: this.attack, defense: this.defense,
      sp_attack: this.sp_attack, sp_defense: this.sp_defense,
      speed: this.speed, hp: this.hp, total: this.total,
    };
  }

  get_name() { return this.name; }
  getHp() { return this.hp; }
  giveHit() { return (this.attack + this.sp_attack) / 2; }
  takeHit(damage) { this.hp = Math.max(0, this.hp - damage); }
  energyWins(energy) { this.hp += (this.hp * energy) / 100; }
  isAlive() { return this.hp > 0; }

  bloqText() {
    const phrases = [
      `${this.name} no pudo dar el golpe`,
      `${this.name} erró`,
      `${this.name} no fue suficientemente veloz`,
      `Han esquivado a ${this.name}`,
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  hitText(damage) {
    const phrases = [
      `${this.name} produce una herida de ${damage} de vida`,
      `${this.name} pega fuerte y quita ${damage} de vida`,
      `El ataque de ${this.name} produce ${damage} en su rival`,
      `Ataque exitoso de ${this.name} quitando ${damage} de vida`,
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  critText(damage) {
    const phrases = [
      `💥 ¡${this.name} conecta un GOLPE CRÍTICO de ${damage} de vida!`,
      `💥 ¡${this.name} aprovecha una apertura y causa ${damage} de daño crítico!`,
      `💥 ¡Golpe devastador de ${this.name} por ${damage} de vida!`,
      `💥 ¡${this.name} da justo en el punto débil y quita ${damage} de vida!`,
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  dodgeText() {
    const phrases = [
      `🍀 ¡${this.name} esquiva milagrosamente el ataque!`,
      `🍀 ¡Por pura suerte, ${this.name} evita el golpe!`,
      `🍀 ¡${this.name} se agacha y el ataque pasa de largo!`,
      `🍀 ¡Increíblemente, ${this.name} logra esquivar!`,
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  // --- Static DB methods ---

  static findAll(limit = 0, offset = 0) {
    let query;
    if (limit > 0) {
      query = db.prepare('SELECT * FROM pokemon ORDER BY name ASC LIMIT ? OFFSET ?');
      return query.all(limit, offset);
    }
    query = db.prepare('SELECT * FROM pokemon ORDER BY name ASC');
    return query.all();
  }

  static count() {
    const row = db.prepare('SELECT COUNT(*) as total FROM pokemon').get();
    return row.total;
  }

  static findByName(name) {
    const row = db.prepare('SELECT * FROM pokemon WHERE name = ?').get(name);
    return row || null;
  }

  static randomExcluding(name) {
    const row = db.prepare('SELECT * FROM pokemon WHERE name != ? ORDER BY RANDOM() LIMIT 1').get(name);
    return row || null;
  }
}

module.exports = Pokemon;
