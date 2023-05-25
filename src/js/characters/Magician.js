import Character from '../Character';

export default class Magician extends Character {
  constructor(level) {
    super(level);
    this.type = 'magician';
    this.attack = 25; // 10
    this.defence = 20; // 40
    this.distance = 1;
    this.attackRange = 4;
  }
}
