import GameStateService from '../GameStateService';

jest.mock('../GameStateService');

beforeEach(() => {
  jest.resetAllMocks();
});

test('testing a successful save game load', () => {
  const stateService = new GameStateService();
  const state = { level: 1 };

  stateService.load.mockReturnValue(state);

  expect(stateService.load()).toEqual(state);
});

test('testing failed save game loading', () => {
  const stateService = new GameStateService();

  stateService.load.mockImplementation(() => {
    throw new Error('Invalid state');
  });

  expect(() => stateService.load()).toThrow('Invalid state');
});
