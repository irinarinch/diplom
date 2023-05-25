import Bowman from '../characters/Bowman';
import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

const character = new Bowman(1);
const gameCtrl = new GameController(new GamePlay(), new GameStateService());
const moveArray = [];
const attackArray = [];

gameCtrl.positionedCharacters = [{ character, position: 8 }];
[gameCtrl.userSelected] = gameCtrl.positionedCharacters;

test('first level Bowman creation testing', () => {
  const result = {
    attack: 30,
    defence: 15,
    health: 50,
    level: 1,
    type: 'bowman',
    attackRange: 2,
    distance: 2,
  };

  expect(character).toEqual(result);
});

test('testing posible move area', () => {
  for (let i = 0; i < 63; i += 1) {
    if (gameCtrl.possibleMoveArea(i, 'user')) {
      moveArray.push(i);
    }
  }

  expect(moveArray).toEqual([0, 1, 9, 10, 16, 17, 24, 26]);
});

test('testing posible attack area', () => {
  for (let i = 0; i < 63; i += 1) {
    if (gameCtrl.possibleAttackArea(i, 'user')) {
      attackArray.push(i);
    }
  }

  expect(attackArray).toEqual([0, 1, 2, 9, 10, 16, 17, 18, 24, 25, 26]);
});
