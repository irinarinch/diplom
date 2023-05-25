import Swordsman from '../characters/Swordsman';
import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

const character = new Swordsman(1);
const gameCtrl = new GameController(new GamePlay(), new GameStateService());
const moveArray = [];
const attackArray = [];

gameCtrl.positionedCharacters = [{ character, position: 0 }];
[gameCtrl.userSelected] = gameCtrl.positionedCharacters;

test('first level Swordsman creation testing', () => {
  const result = {
    type: 'swordsman',
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
    if (gameCtrl.possibleMoveArea(i, 'user')) {
      moveArray.push(i);
    }
  }

  expect(moveArray).toEqual([1, 2, 3, 4, 8, 9, 16, 18, 24, 27, 32, 36]);
});

test('testing posible attack area', () => {
  for (let i = 0; i < 63; i += 1) {
    if (gameCtrl.possibleAttackArea(i, 'user')) {
      attackArray.push(i);
    }
  }

  expect(attackArray).toEqual([1, 8, 9]);
});
