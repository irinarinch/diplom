import { calcTileType } from '../utils';

test('calcTileType return top-left', () => {
  expect(calcTileType(0, 8)).toBe('top-left');
});

test('calcTileType return top', () => {
  expect(calcTileType(1, 8)).toBe('top');
});

test('calcTileType return top-right', () => {
  expect(calcTileType(7, 8)).toBe('top-right');
});

test('calcTileType return left', () => {
  expect(calcTileType(8, 8)).toBe('left');
});

test('calcTileType return center', () => {
  expect(calcTileType(9, 8)).toBe('center');
});

test('calcTileType return right', () => {
  expect(calcTileType(31, 8)).toBe('right');
});

test('calcTileType return bottom-left', () => {
  expect(calcTileType(56, 8)).toBe('bottom-left');
});

test('calcTileType return bottom', () => {
  expect(calcTileType(59, 8)).toBe('bottom');
});

test('calcTileType return bottom-right', () => {
  expect(calcTileType(63, 8)).toBe('bottom-right');
});
