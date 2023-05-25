import Character from '../Character';
import Bowman from '../characters/Bowman';

test('testing create base character', () => {
  expect(() => {
    const character = new Character(1);
    character.name = 'character';
  }).toThrow("You can't create base character");
});

test('testing create extends character', () => {
  const result = {
    attack: 30, defence: 15, health: 50, level: 1, type: 'bowman', attackRange: 2, distance: 2,
  };
  expect(new Bowman(1)).toEqual(result);
});

test('testing create extends character with incorrect level', () => { // asdafdsfadfs
  expect(() => {
    const bowman = new Bowman(0);
    bowman.name = 'bowman';
  }).toThrow('Incorrect level number');
});
