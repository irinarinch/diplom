import Daemon from '../characters/Daemon';
import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

const character = new Daemon(1);
const gameCtrl = new GameController(new GamePlay(), new GameStateService());
const moveArray = [];
const attackArray = [];

gameCtrl.positionedCharacters = [{ character, position: 7 }];
[gameCtrl.computerSelected] = gameCtrl.positionedCharacters;

test('first level Daemon creation testing', () => {
  const result = {
    attack: 25,
    defence: 10,
    distance: 1,
    attackRange: 4,
    health: 50,
    level: 1,
    type: 'daemon',
  };

  expect(character).toEqual(result);
});

test('testing posible move area', () => {
  for (let i = 0; i < 63; i += 1) {
    if (gameCtrl.possibleMoveArea(i, 'pc')) {
      moveArray.push(i);
    }
  }

  expect(moveArray).toEqual([6, 14, 15]);
});

test('testing posible attack area', () => {
  for (let i = 0; i < 63; i += 1) {
    if (gameCtrl.possibleAttackArea(i, 'pc')) {
      attackArray.push(i);
    }
  }

  const result = [
    3, 4, 5, 6, 11, 12, 13, 14, 15, 19, 20, 21, 22, 23, 27, 28, 29, 30, 31, 35, 36, 37, 38, 39,
  ];

  expect(attackArray).toEqual(result);
});
