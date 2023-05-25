import Undead from '../characters/Undead';
import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

const character = new Undead(1);
const gameCtrl = new GameController(new GamePlay(), new GameStateService());
const moveArray = [];
const attackArray = [];

gameCtrl.positionedCharacters = [{ character, position: 7 }];
[gameCtrl.computerSelected] = gameCtrl.positionedCharacters;

test('first level Undead creation testing', () => {
  const result = {
    type: 'undead',
    attack: 40,
    defence: 10,
    distance: 4,
    attackRange: 1,
    health: 50,
    level: 1,
  };

  expect(character).toEqual(result);
});

test('testing posible move area', () => {
  for (let i = 0; i < 63; i += 1) {
    if (gameCtrl.possibleMoveArea(i, 'pc')) {
      moveArray.push(i);
    }
  }

  expect(moveArray).toEqual([3, 4, 5, 6, 14, 15, 21, 23, 28, 31, 35, 39]);
});

test('testing posible attack area', () => {
  for (let i = 0; i < 63; i += 1) {
    if (gameCtrl.possibleAttackArea(i, 'pc')) {
      attackArray.push(i);
    }
  }

  expect(attackArray).toEqual([6, 14, 15]);
});
