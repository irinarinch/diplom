/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
*/
export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    // +++ TODO: выбросите исключение, если кто-то использует "new Character()"
    function UserException(message) {
      this.message = message;
      this.name = 'Исключение, определённое пользователем';
    }

    if (level < 1 || level > 4 || typeof level !== 'number') {
      throw new UserException('Incorrect level number');
    }

    if (new.target.name === 'Character') {
      throw new UserException('You can\'t create base character');
    }
  }
}
