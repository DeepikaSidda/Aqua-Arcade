/**
 * Manages scoring and combo system
 */

export type ScoreChangeListener = (score: number, delta: number) => void;
export type ComboChangeListener = (combo: number) => void;

/**
 * Manages game score and combo multiplier
 */
export class ScoreManager {
  private _score: number = 0;
  private _combo: number = 1;
  private _maxCombo: number = 1;
  private scoreListeners: ScoreChangeListener[] = [];
  private comboListeners: ComboChangeListener[] = [];

  /**
   * Adds points to the score
   */
  addScore(points: number): void {
    const actualPoints = Math.floor(points * this._combo);
    this._score += actualPoints;

    // Notify listeners
    this.scoreListeners.forEach((listener) => listener(this._score, actualPoints));
  }

  /**
   * Subtracts points from the score (penalty)
   */
  subtractScore(points: number): void {
    const oldScore = this._score;
    this._score = Math.max(0, this._score - points);

    // Notify listeners
    this.scoreListeners.forEach((listener) => listener(this._score, -(oldScore - this._score)));
  }

  /**
   * Increases the combo multiplier
   */
  increaseCombo(): void {
    this._combo++;
    if (this._combo > this._maxCombo) {
      this._maxCombo = this._combo;
    }

    // Notify listeners
    this.comboListeners.forEach((listener) => listener(this._combo));
  }

  /**
   * Resets the combo multiplier to 1
   */
  resetCombo(): void {
    if (this._combo === 1) {
      return;
    }

    this._combo = 1;

    // Notify listeners
    this.comboListeners.forEach((listener) => listener(this._combo));
  }

  /**
   * Gets the current score
   */
  get score(): number {
    return this._score;
  }

  /**
   * Gets the current combo multiplier
   */
  get combo(): number {
    return this._combo;
  }

  /**
   * Gets the maximum combo achieved
   */
  get maxCombo(): number {
    return this._maxCombo;
  }

  /**
   * Adds a score change listener
   */
  addScoreListener(listener: ScoreChangeListener): void {
    this.scoreListeners.push(listener);
  }

  /**
   * Removes a score change listener
   */
  removeScoreListener(listener: ScoreChangeListener): void {
    const index = this.scoreListeners.indexOf(listener);
    if (index !== -1) {
      this.scoreListeners.splice(index, 1);
    }
  }

  /**
   * Adds a combo change listener
   */
  addComboListener(listener: ComboChangeListener): void {
    this.comboListeners.push(listener);
  }

  /**
   * Removes a combo change listener
   */
  removeComboListener(listener: ComboChangeListener): void {
    const index = this.comboListeners.indexOf(listener);
    if (index !== -1) {
      this.comboListeners.splice(index, 1);
    }
  }

  /**
   * Resets the score and combo
   */
  reset(): void {
    this._score = 0;
    this._combo = 1;
    this._maxCombo = 1;

    // Notify listeners
    this.scoreListeners.forEach((listener) => listener(0, 0));
    this.comboListeners.forEach((listener) => listener(1));
  }
}
