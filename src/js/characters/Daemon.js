import Character from '../Character';

export default class Daemon extends Character {
  constructor(level) {
    super(level);
    this.type = 'daemon';
    this.attack = 25; // 10
    this.defence = 10;
    this.distance = 1;
    this.attackRange = 4;
  }
}
