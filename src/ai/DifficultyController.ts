/**
 * Adaptive difficulty system
 */

import { DifficultyConfig } from '../utils/config';

export enum ActionResult {
  FISH_POPPED = 'FISH_POPPED',
  DECOY_CLICKED = 'DECOY_CLICKED',
  MISS = 'MISS',
}

export interface PerformanceMetrics {
  accuracy: number;
  recentActions: ActionResult[];
  averageReactionTime: number;
  comboCount: number;
  flowStateScore: number;
}

/**
 * Controls adaptive difficulty
 */
export class DifficultyController {
  private currentDifficulty: number = 0.3; // 0-1 scale
  private targetDifficulty: number = 0.3;
  private recentActions: ActionResult[] = [];
  private adjustmentTimer: number = 0;
  private readonly maxActions: number = 20;

  constructor(private config: DifficultyConfig) {}

  /**
   * Initializes the difficulty controller
   */
  initialize(config: DifficultyConfig): void {
    this.config = config;
    this.currentDifficulty = 0.3;
    this.targetDifficulty = 0.3;
  }

  /**
   * Updates difficulty based on performance metrics
   */
  update(metrics: PerformanceMetrics, deltaTime: number): void {
    this.recentActions = metrics.recentActions;
    this.adjustmentTimer += deltaTime;

    // Only adjust every adjustmentWindow seconds
    if (this.adjustmentTimer < this.config.adjustmentWindow) {
      // Smooth transition towards target
      const smoothing = 0.1;
      this.currentDifficulty += (this.targetDifficulty - this.currentDifficulty) * smoothing * deltaTime;
      return;
    }

    this.adjustmentTimer = 0;

    // Calculate accuracy
    const accuracy = this.calculateAccuracy();

    // Adjust target difficulty
    if (accuracy >= this.config.accuracyThresholds.increase) {
      this.targetDifficulty = Math.min(1.0, this.targetDifficulty + this.config.difficultyScalingFactor);
    } else if (accuracy <= this.config.accuracyThresholds.decrease) {
      this.targetDifficulty = Math.max(0.1, this.targetDifficulty - this.config.difficultyScalingFactor);
    }
  }

  /**
   * Records a player action
   */
  recordAction(action: ActionResult): void {
    this.recentActions.push(action);
    
    if (this.recentActions.length > this.maxActions) {
      this.recentActions.shift();
    }
  }

  /**
   * Calculates current accuracy
   */
  private calculateAccuracy(): number {
    if (this.recentActions.length === 0) {
      return 0.5;
    }

    const successes = this.recentActions.filter(a => a === ActionResult.FISH_POPPED).length;
    return successes / this.recentActions.length;
  }

  /**
   * Manually adjusts difficulty
   */
  adjustDifficulty(delta: number): void {
    this.targetDifficulty = Math.max(0.1, Math.min(1.0, this.targetDifficulty + delta));
  }

  /**
   * Gets current difficulty level (0-1)
   */
  getCurrentDifficulty(): number {
    return this.currentDifficulty;
  }

  /**
   * Gets spawn rate based on difficulty
   */
  getSpawnRate(): number {
    const range = this.config.maxSpawnRate - this.config.minSpawnRate;
    return this.config.minSpawnRate + (range * this.currentDifficulty);
  }

  /**
   * Gets movement speed multiplier based on difficulty
   */
  getMovementSpeedMultiplier(): number {
    return 1 + this.currentDifficulty * 0.5;
  }

  /**
   * Resets difficulty to baseline
   */
  reset(): void {
    this.currentDifficulty = 0.3;
    this.targetDifficulty = 0.3;
    this.recentActions = [];
    this.adjustmentTimer = 0;
  }
}
