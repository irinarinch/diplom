/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
import Team from './Team';

export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const randomClass = Math.floor(Math.random() * allowedTypes.length);
    const randomLevel = Math.floor(1 + Math.random() * maxLevel);

    yield new allowedTypes[randomClass](randomLevel);
  }
}
/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей.
 * Количество персонажей в команде - characterCount
 * */

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const teamMembersArray = [];

  for (let i = 0; i < characterCount; i += 1) {
    teamMembersArray.push(characterGenerator(allowedTypes, maxLevel).next().value);
  }

  return new Team(teamMembersArray);
}

export function createTooltip(character) {
  return `\u{1F396} ${character.level} \u{2694} ${character.attack} \u{1F6E1} ${character.defence} \u{2764} ${character.health}`;
}
