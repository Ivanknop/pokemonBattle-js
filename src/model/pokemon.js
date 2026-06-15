const Entity = require("../core/entity");

class Pokemon extends Entity {
  constructor(name, vitality, characteristics) {
    super(name, vitality, characteristics);
    this.type1 = characteristics.type1 || null;
    this.type2 = characteristics.type2 || null;
  }

  offensivePower() {
    return (
      this.characteristics["attack"] * 0.6 +
      this.characteristics["sp_attack"] * 0.4
    );
  }

  defensivePower() {
    return (
      this.characteristics["defense"] * 0.7 +
      this.characteristics["sp_defense"] * 0.3
    );
  }

  initiative() {
    return this.characteristics["speed"];
  }

  getPrincipalType() {
    return this.type1;
  }

  getSecondaryType() {
    return this.type2;
  }

  static fromDict(data) {
    const pokemon = new Pokemon(data.name, data.vitality, data.characteristics);
    pokemon.setVitality(data.vitality);
    return pokemon;
  }
}

module.exports = Pokemon;
