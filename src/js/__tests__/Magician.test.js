import Magician from '../characters/Magician';
import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

const character = new Magician(1);
const gameCtrl = new GameController(new GamePlay(), new GameStateService());
const moveArray = [];
const attackArray = [];

gameCtrl.positionedCharacters = [{ character, position: 0 }];
[gameCtrl.userSelected] = gameCtrl.positionedCharacters;

test('first level Magician creation testing', () => {
  const result = {
    type: 'magician',
    attack: 25,
    defence: 20,
    distance: 1,
    attackRange: 4,
    health: 50,
    level: 1,
  };

  expect(character).toEqual(result);
});

test('testing posible move area', () => {
  for (let i = 0; i < 63; i += 1) {
    if (gameCtrl.possibleMoveArea(i, 'user')) {
      moveArray.push(i);
    }
  }

  expect(moveArray).toEqual([1, 8, 9]);
});

test('testing posible attack area', () => {
  for (let i = 0; i < 63; i += 1) {
    if (gameCtrl.possibleAttackArea(i, 'user')) {
      attackArray.push(i);
    }
  }

  const result = [
    1, 2, 3, 4, 8, 9, 10, 11, 12, 16, 17, 18, 19, 20, 24, 25, 26, 27, 28, 32, 33, 34, 35, 36,
  ];

  expect(attackArray).toEqual(result);
});
