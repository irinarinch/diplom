import GamePlay from './GamePlay';
import GameState from './GameState';
import themes from './themes';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Daemon from './characters/Daemon';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import PositionedCharacter from './PositionedCharacter';

import { generateTeam, createTooltip } from './generators';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.boardSize = this.gamePlay.boardSize;
    this.board = new Array(this.boardSize ** 2);
  }

  init() {
    this.newGame();

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(() => this.newGame());
    this.gamePlay.addSaveGameListener(() => this.saveGame());
    this.gamePlay.addLoadGameListener(() => this.loadGame());
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  newGame() {
    this.positionedCharacters = [];
    this.userSelected = null;
    this.computerSelected = null;
    this.notAllowedCell = null;
    this.points = 0;

    this.level = 1;

    this.getUserTeam();
    this.getPcTeam();

    this.gamePlay.drawUi(themes[this.level]);
    this.gamePlay.redrawPositions(this.positionedCharacters);

    this.activePlayer = 'user';
    if (!GameState.print()) {
      this.maxPoints = this.points;
    } else {
      this.maxPoints = GameState.print();
    }
  }

  saveGame() {
    this.stateService.save(GameState.from(this));
  }

  loadGame() {
    try {
      this.notAllowedCell = null;
      const {
        positionedCharacters, userSelected, computerSelected, points, level, activePlayer,
      } = this.stateService.load();
      this.positionedCharacters = positionedCharacters;
      this.userSelected = userSelected;
      this.computerSelected = computerSelected;

      this.points = points;

      this.level = level;
      this.activePlayer = activePlayer;

      this.gamePlay.drawUi(themes[this.level]);
      this.gamePlay.redrawPositions(this.positionedCharacters);

      setTimeout(() => {
        this.pcActions();
      }, 1000);

      this.maxPoints = GameState.print();
    } catch (e) {
      GamePlay.showError('Игра не сохранялась, продолжим игру');
      throw new Error('Invalid state');
    }
  }

  static getRandomPosition(area) {
    const index = Math.floor(Math.random() * area.length);
    return area.splice(index, 1)[0];
  }

  getUserTeam() {
    const userTeamArray = generateTeam([Bowman, Swordsman, Magician], 3, 4);
    const userTeamArea = [];

    for (let i = 0; i < this.board.length; i += 1) {
      this.board[i] = i;

      if (i % this.boardSize === 0 || i % this.boardSize === 1) {
        userTeamArea.push(this.board[i]);
      }
    }

    userTeamArray.characters.forEach((character) => {
      character.team = 'user';
      const index = GameController.getRandomPosition(userTeamArea);

      if (!this.containCharacter(index)) {
        this.positionedCharacters.push(new PositionedCharacter(character, index));
      }

      const pushed = this.positionedCharacters[this.positionedCharacters.length - 1];

      if (pushed.character.level > 1) {
        for (let i = 1; i < pushed.character.level; i += 1) {
          GameController.levelUp(pushed);
        }
      }
    });
  }

  getPcTeam() {
    const pcTeamArray = generateTeam([Daemon, Undead, Vampire], 3, 4);
    const pcTeamArea = [];

    for (let i = 0; i < this.board.length; i += 1) {
      this.board[i] = i;

      if (i % this.boardSize === this.boardSize - 2 || i % this.boardSize === this.boardSize - 1) {
        pcTeamArea.push(this.board[i]);
      }
    }

    pcTeamArray.characters.forEach((character) => {
      character.team = 'pc';
      const index = GameController.getRandomPosition(pcTeamArea);

      if (!this.containCharacter(index)) {
        this.positionedCharacters.push(new PositionedCharacter(character, index));
      }

      const pushed = this.positionedCharacters[this.positionedCharacters.length - 1];

      if (pushed.character.level > 1) {
        for (let i = 1; i < pushed.character.level; i += 1) {
          GameController.levelUp(pushed);
        }
      }
    });
  }

  containCharacter(index) {
    if (this.positionedCharacters.find((el) => el.position === index)) {
      return this.positionedCharacters.find((el) => el.position === index);
    }
    return false;
  }

  onCellEnter(index) {
    this.gamePlay.setCursor('auto');

    if (this.containCharacter(index)) {
      this.gamePlay.setCursor('pointer');

      this.gamePlay.showCellTooltip(
        createTooltip(this.containCharacter(index).character),
        index,
      );
    }

    if (this.userSelected) {
      this.gamePlay.selectCell(this.userSelected.position);
      this.gamePlay.setCursor('not-allowed');
      this.notAllowedCell = true;

      if (this.possibleMoveArea(index, 'user') && (index !== this.userSelected.position) && !this.hasEnemy(index)) {
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor('pointer');
        this.notAllowedCell = false;
      }

      if (this.possibleAttackArea(index, 'user') && this.hasEnemy(index)) {
        this.gamePlay.selectCell(index, 'red');
        this.gamePlay.setCursor('crosshair');
        this.notAllowedCell = false;
      }

      if (
        this.containCharacter(index)
        && !this.hasEnemy(index)
        && (index !== this.userSelected.position)
      ) {
        this.gamePlay.deselectCell(index);
        this.gamePlay.setCursor('pointer');
        this.notAllowedCell = false;
      }
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.deselectCell(index);
  }

  async onCellClick(index) {
    if (this.notAllowedCell) {
      GamePlay.showError('Недопустимое действие');
    }

    if (this.activePlayer === 'pc') {
      this.userSelected = null;
      this.gamePlay.deselectCell(index);
      GamePlay.showError('Дождитесь своего хода');
    }

    if (this.containCharacter(index) && this.containCharacter(index).character.team === 'user') {
      this.computerSelected = null;
      if (!this.userSelected) {
        this.gamePlay.selectCell(index);
        this.userSelected = this.containCharacter(index);
      } else {
        this.gamePlay.deselectCell(this.userSelected.position);
        this.gamePlay.selectCell(index);
        this.userSelected = this.containCharacter(index);
      }
    }

    if (!this.userSelected) {
      GamePlay.showError('Вы должны выбрать персонаж');
    }

    if (
      this.userSelected
      && !this.notAllowedCell
      && !this.containCharacter(index)
    ) { // перемещение персонажа игрока
      this.gamePlay.deselectCell(this.userSelected.position);
      this.userSelected.position = index;

      await this.gamePlay.redrawPositions(this.positionedCharacters);
      this.userSelected = null;

      this.activePlayer = 'pc';
      this.pcStep();
    }

    if (this.userSelected && !this.notAllowedCell && this.possibleAttackArea(index, 'user') && this.hasEnemy(index)) { // attack персонажа игрока
      this.attack(index, 'user');
      await this.gamePlay.deselectCell(this.userSelected.position);
      this.userSelected = null;

      this.activePlayer = 'pc';
      this.pcStep();
    }
  }

  pcStep() {
    if (this.activePlayer === 'pc') {
      if (this.check('pc')) {
        setTimeout(() => {
          this.pcActions();
        }, 1000);
      } else {
        setTimeout(() => {
          this.newLevel();
        }, 1000);
      }
    }
  }

  newLevel() {
    if (this.level < 4) {
      this.level += 1;

      this.gamePlay.drawUi(themes[this.level]);
      this.positionedCharacters.forEach((el) => {
        el.character.level += 1;
        GameController.levelUp(el);
      });

      this.getPcTeam();
      this.gamePlay.redrawPositions(this.positionedCharacters);
      this.pcStep();
    }

    if ((this.level === 4) && !this.check('pc')) {
      GamePlay.showMessage(`Победа! Набрано очков: ${this.points}. Рекорд: ${GameState.print()}. Начнем новую игру `);
      this.newGame();
    }
  }

  static levelUp(el) {
    el.character.defence = Math.round(
      Math.max(el.character.defence, (el.character.defence * (80 + el.character.health)) / 100),
    );

    el.character.attack = Math.round(
      Math.max(el.character.attack, (el.character.attack * (80 + el.character.health)) / 100),
    );

    if (el.character.health <= 20) {
      el.character.health += 80;
    } else {
      el.character.health = 100;
    }
  }

  attack(index, player) {
    let attacker = null;
    if (player === 'user') {
      attacker = this.userSelected.character;
    } else if (player === 'pc') {
      attacker = this.computerSelected.character;
    }

    const target = this.containCharacter(index).character;
    const damage = Math.round(Math.max(attacker.attack - target.defence, attacker.attack * 0.1));

    target.health -= damage;

    if (GameController.pcTeamMember(target)) {
      this.points += damage;
    }
    GameState.from(this);

    this.gamePlay.showDamage(index, damage).then(() => {
      this.gamePlay.redrawPositions(this.positionedCharacters);
    });

    if (target.health <= 0) {
      const deadCharacterIndex = this.positionedCharacters.findIndex(
        (el) => el.character.health === target.health,
      );

      this.positionedCharacters.splice(deadCharacterIndex, 1);

      this.gamePlay.redrawPositions(this.positionedCharacters);
    }
  }

  check(team) {
    if (this.positionedCharacters.find((el) => el.character.team === team)) {
      return true;
    }
    return false;
  }

  static userTeamMember(character) {
    if (character.team === 'user') {
      return true;
    }
    return false;
  }

  static pcTeamMember(character) {
    if (character.team === 'pc') {
      return true;
    }
    return false;
  }

  hasEnemy(index) {
    if (!this.containCharacter(index)) {
      return false;
    }

    if (
      this.userSelected
      && GameController.userTeamMember(this.userSelected.character)
      && GameController.pcTeamMember(this.containCharacter(index).character)
    ) {
      return true;
    }

    if (
      this.computerSelected
      && GameController.pcTeamMember(this.computerSelected.character)
      && GameController.userTeamMember(this.containCharacter(index).character)
    ) {
      return true;
    }

    return false;
  }

  possibleMoveArea(index, player) {
    let position = null;
    let distance = null;

    if (player === 'user') {
      position = this.userSelected.position;
      distance = this.userSelected.character.distance;
    } else if (player === 'pc') {
      position = this.computerSelected.position;
      distance = this.computerSelected.character.distance;
    }

    const indexX = index % this.boardSize;
    const positionX = position % this.boardSize;
    const indexY = Math.floor(index / this.boardSize);
    const positionY = Math.floor(position / this.boardSize);

    if (this.containCharacter(index)) {
      return false;
    }

    if ((indexY === positionY) && (Math.abs(index - position) <= distance)) {
      return true; // горизонталь
    }

    if ((indexX === positionX) && (Math.abs(indexY - positionY) <= distance)) {
      return true; // вертикаль
    }

    if (
      Math.abs(indexX - positionX) === Math.abs(indexY - positionY)
      && Math.abs(indexX - positionX) <= distance
    ) {
      return true; // диагональ
    }

    return false;
  }

  possibleAttackArea(index, player) {
    let position = null;
    let attackRange = null;

    if (player === 'user') {
      position = this.userSelected.position;
      attackRange = this.userSelected.character.attackRange;
    } else if (player === 'pc') {
      position = this.computerSelected.position;
      attackRange = this.computerSelected.character.attackRange;
    }

    const indexX = index % this.boardSize;
    const positionX = position % this.boardSize;
    const indexY = Math.floor(index / this.boardSize);
    const positionY = Math.floor(position / this.boardSize);

    if (
      (Math.abs(indexY - positionY) <= attackRange)
      && (Math.abs(indexX - positionX) <= attackRange)
      && (index !== position)
    ) {
      return true;
    }
    return false;
  }

  canAttack(index) {
    if (this.possibleAttackArea(index, 'pc')) {
      return true;
    }
    return false;
  }

  static chooseStrongest(array) {
    const attackArr = [];
    const strongestArr = [];

    array.forEach((el) => {
      const { attack } = el.character;
      attackArr.push(attack);
    });
    const max = Math.max(...attackArr);

    array.forEach((el) => {
      if (el.character.attack === max) {
        strongestArr.push(el);
      }
    });

    if (strongestArr.length > 1) {
      const randomIndex = Math.floor(Math.random() * strongestArr.length);
      return strongestArr[randomIndex];
    }
    return strongestArr[0];
  }

  pcActions() {
    const userPositions = [];
    const pcPositions = [];
    const targetsArr = [];
    const attackersArr = [];
    const cannotAttackArr = [];
    const notTargets = [];

    this.positionedCharacters.forEach((el) => {
      if (GameController.userTeamMember(el.character)) {
        userPositions.push(el.position); // позиции команды юзера
      } else {
        pcPositions.push(el.position); // позиции команды пк
      }
    });

    if (this.check('pc') && this.activePlayer === 'pc') {
      pcPositions.forEach((index) => {
        this.computerSelected = this.containCharacter(index);

        for (let i = 0; i < userPositions.length; i += 1) {
          if (this.canAttack(userPositions[i])) {
            // могут атаковать
            attackersArr.push(this.containCharacter(index));
            // могут быть атакованы
            if (!targetsArr.includes(userPositions[i])) {
              targetsArr.push(this.containCharacter(userPositions[i]));
            }
          } else {
            // НЕ могут атаковать
            if (!cannotAttackArr.includes(this.containCharacter(index))) {
              cannotAttackArr.push(this.containCharacter(index));
            }
            // НЕ могут быть атакован
            if (!notTargets.includes(this.containCharacter(userPositions[i]))) {
              notTargets.push(this.containCharacter(userPositions[i]));
            }
          }
        }
      });

      // если никто не может атаковать сильнейший перемещается
      if (attackersArr.length === 0 && this.computerSelected) {
        // выбран сильнейший персонаж пк
        this.computerSelected = GameController.chooseStrongest(cannotAttackArr);

        const computerSelectedX = this.computerSelected.position % this.boardSize;
        const computerSelectedY = Math.floor(this.computerSelected.position / this.boardSize);
        const { distance } = this.computerSelected.character;

        let minX = computerSelectedX - distance;
        if (minX < 0) {
          minX = 0;
        }

        let maxX = computerSelectedX + distance;
        if (maxX > this.boardSize - 1) {
          maxX = this.boardSize - 1;
        }

        let maxY = computerSelectedY + distance;
        if (maxY > this.boardSize - 1) {
          maxY = this.boardSize - 1;
        }

        let minY = computerSelectedY - distance;
        if (minY < 0) {
          minY = 0;
        }
        // сильнейший персонаж юзера
        const strongestEnemy = GameController.chooseStrongest(notTargets);
        const strongestEnemyX = strongestEnemy.position % this.boardSize;
        const strongestEnemyY = Math.floor(strongestEnemy.position / this.boardSize);

        // массив возможных для передвижения индексов
        const moveArr = [];

        this.board.forEach((index) => {
          if (this.possibleMoveArea(index, 'pc')) {
            if (computerSelectedX > strongestEnemyX) {
              if ((index % this.boardSize) === minX) {
                moveArr.push(index);
              }
            }

            if (computerSelectedX < strongestEnemyX) {
              maxX = strongestEnemyX;
              if ((index % this.boardSize) === maxX) {
                moveArr.push(index);
              }
            }

            if (computerSelectedX === strongestEnemyX) {
              if ((index % this.boardSize) === computerSelectedX) {
                moveArr.push(index);
              }
            }
          }
        });

        if ((strongestEnemyY === computerSelectedY)) {
          const randomPosition = Math.floor(Math.random() * moveArr.length);
          this.computerSelected.position = moveArr[randomPosition];
        }

        if (strongestEnemyY > computerSelectedY) {
          this.computerSelected.position = Math.max(...moveArr);
        } else if (strongestEnemyY < computerSelectedY) {
          this.computerSelected.position = Math.min(...moveArr);
        }

        this.gamePlay.redrawPositions(this.positionedCharacters);
      }
      // сильнейший атакует сильнейшего
      if (attackersArr.length > 0) {
        this.computerSelected = GameController.chooseStrongest(attackersArr);
        const target = GameController.chooseStrongest(targetsArr);

        this.attack(target.position, 'pc');
      }
    }

    this.activePlayer = 'user';

    if (!this.check('user')) {
      GamePlay.showMessage(`Вы проиграли! Набрано очков: ${this.points}. Рекорд: ${GameState.print()}. Начнем новую игру`);
      this.newGame();
    }
  }
}
