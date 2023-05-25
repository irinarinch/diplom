import Character from '../Character';

export default class Bowman extends Character {
  constructor(level) {
    super(level);
    this.type = 'bowman';
    this.attack = 30; // 25
    this.defence = 15; // 25
    this.distance = 2;
    this.attackRange = 2;
  }
}
