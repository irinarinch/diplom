import Vampire from '../characters/Vampire';
import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

const character = new Vampire(1);
const gameCtrl = new GameController(new GamePlay(), new GameStateService());
const moveArray = [];
const attackArray = [];

gameCtrl.positionedCharacters = [{ character, position: 7 }];
[gameCtrl.computerSelected] = gameCtrl.positionedCharacters;

test('first level Vampire creation testing', () => {
  const result = {
    type: 'vampire',
    attack: 30,
    defence: 10,
    distance: 2,
    attackRange: 2,
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

  expect(moveArray).toEqual([5, 6, 14, 15, 21, 23]);
});

test('testing posible attack area', () => {
  for (let i = 0; i < 63; i += 1) {
    if (gameCtrl.possibleAttackArea(i, 'pc')) {
      attackArray.push(i);
    }
  }

  expect(attackArray).toEqual([5, 6, 13, 14, 15, 21, 22, 23]);
});
