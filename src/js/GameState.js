export default class GameState {
  static from(gameCtrl) {
    this.state = {};

    this.state.positionedCharacters = gameCtrl.positionedCharacters;
    this.state.userSelected = gameCtrl.userSelected;
    this.state.computerSelected = gameCtrl.computerSelected;
    this.state.points = gameCtrl.points;
    this.state.level = gameCtrl.level;
    this.state.activePlayer = gameCtrl.activePlayer;

    return this.state;
  }

  static print() {
    if (this.state === undefined) {
      this.maxPoints = 0;
    } else if (this.state.points >= this.maxPoints) {
      this.maxPoints = this.state.points;
    } else if (this.state.points < this.maxPoints) {
      return this.maxPoints;
    }

    return this.maxPoints;
  }
}
