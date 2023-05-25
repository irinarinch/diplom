import { characterGenerator, generateTeam, createTooltip } from '../generators';

import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';

test('should generate', () => {
  // внимание тест не нормальный! не могу найти как протестировать бесконечную генерацию
  // как проверить бесконечный цикл, если его создать?
  const playerTypes = [Bowman, Swordsman, Magician];
  const playerGenerator = characterGenerator(playerTypes, 2);

  playerGenerator.next();
  playerGenerator.next();
  playerGenerator.next();
  playerGenerator.next();

  expect(playerGenerator.next().done).toBe(false);
});

test('testing generation correct level', () => {
  const playerTypes = [Bowman, Swordsman, Magician];
  const playerGenerator = characterGenerator(playerTypes, 2);
  const { level } = playerGenerator.next().value;

  function correctLevelRange(a, b) {
    if (level >= a && level <= b) {
      return true;
    }
    return false;
  }

  expect(correctLevelRange(1, 2)).toBe(true);
});

test('checking the correct number of team members', () => {
  const team = generateTeam([Bowman, Swordsman, Magician], 3, 4);
  expect(team.characters.length).toBe(4);
});

test('checking the correct tooltip values', () => {
  const bowman = new Bowman(1);
  const str = '\u{1F396} 1 \u{2694} 30 \u{1F6E1} 15 \u{2764} 50';

  expect(createTooltip(bowman)).toBe(str);
});
