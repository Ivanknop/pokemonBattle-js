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

export class Pokemon {
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

  constructor(data: PokemonData) {
    this.name = data.name;
    this.type1 = data.type1;
    this.type2 = data.type2;
    this.attack = data.attack;
    this.defense = data.defense;
    this.spAttack = data.spAttack;
    this.spDefense = data.spDefense;
    this.speed = data.speed;
    this.hp = data.hp;
    this.total = data.total;
  }

  getCharacteristics(): PokemonData {
    return {
      name: this.name,
      type1: this.type1,
      type2: this.type2,
      attack: this.attack,
      defense: this.defense,
      spAttack: this.spAttack,
      spDefense: this.spDefense,
      speed: this.speed,
      hp: this.hp,
      total: this.total,
    };
  }

  getHp(): number {
    return this.hp;
  }

  takeHit(damage: number): void {
    this.hp = Math.max(0, this.hp - damage);
  }

  isAlive(): boolean {
    return this.hp > 0;
  }
}
