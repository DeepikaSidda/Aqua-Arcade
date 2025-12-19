/**
 * Game state management
 */

export enum GameState {
  START_SCREEN = 'START_SCREEN',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
}

export type StateChangeListener = (oldState: GameState, newState: GameState) => void;

/**
 * Manages game state transitions
 */
export class GameStateMachine {
  private _currentState: GameState;
  private listeners: StateChangeListener[] = [];

  constructor(initialState: GameState = GameState.START_SCREEN) {
    this._currentState = initialState;
  }

  get currentState(): GameState {
    return this._currentState;
  }

  /**
   * Transitions to a new state
   */
  transition(newState: GameState): void {
    if (this._currentState === newState) {
      return;
    }

    const oldState = this._currentState;
    this._currentState = newState;

    // Notify listeners
    this.listeners.forEach((listener) => listener(oldState, newState));
  }

  /**
   * Adds a state change listener
   */
  addListener(listener: StateChangeListener): void {
    this.listeners.push(listener);
  }

  /**
   * Removes a state change listener
   */
  removeListener(listener: StateChangeListener): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Checks if currently in a specific state
   */
  isState(state: GameState): boolean {
    return this._currentState === state;
  }

  /**
   * Resets to initial state
   */
  reset(): void {
    this.transition(GameState.START_SCREEN);
  }
}
