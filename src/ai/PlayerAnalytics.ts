/**
 * Advanced player analytics and pattern recognition
 */

import { Point } from '../utils/Point';

interface ClickData {
  position: Point;
  timestamp: number;
  wasSuccess: boolean;
  reactionTime: number;
}

interface HeatmapCell {
  x: number;
  y: number;
  clickCount: number;
  successRate: number;
}

/**
 * Analyzes player behavior and patterns
 */
export class PlayerAnalytics {
  private clickHistory: ClickData[] = [];
  private maxHistorySize: number = 50;
  private heatmapGrid: HeatmapCell[][] = [];
  private gridSize: number = 50; // 50x50 pixel cells
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.initializeHeatmap();
  }

  /**
   * Initializes the heatmap grid
   */
  private initializeHeatmap(): void {
    const cols = Math.ceil(this.canvasWidth / this.gridSize);
    const rows = Math.ceil(this.canvasHeight / this.gridSize);

    for (let y = 0; y < rows; y++) {
      this.heatmapGrid[y] = [];
      for (let x = 0; x < cols; x++) {
        this.heatmapGrid[y][x] = {
          x: x * this.gridSize,
          y: y * this.gridSize,
          clickCount: 0,
          successRate: 0,
        };
      }
    }
  }

  /**
   * Records a click
   */
  recordClick(position: Point, wasSuccess: boolean, reactionTime: number): void {
    // Add to history
    this.clickHistory.push({
      position: { ...position },
      timestamp: Date.now(),
      wasSuccess,
      reactionTime,
    });

    // Limit history size
    if (this.clickHistory.length > this.maxHistorySize) {
      this.clickHistory.shift();
    }

    // Update heatmap
    this.updateHeatmap(position, wasSuccess);
  }

  /**
   * Updates the heatmap with a new click
   */
  private updateHeatmap(position: Point, wasSuccess: boolean): void {
    const col = Math.floor(position.x / this.gridSize);
    const row = Math.floor(position.y / this.gridSize);

    if (row >= 0 && row < this.heatmapGrid.length && col >= 0 && col < this.heatmapGrid[0].length) {
      const cell = this.heatmapGrid[row][col];
      const oldCount = cell.clickCount;
      const oldSuccessRate = cell.successRate;

      cell.clickCount++;
      // Update success rate using running average
      cell.successRate = (oldSuccessRate * oldCount + (wasSuccess ? 1 : 0)) / cell.clickCount;
    }
  }

  /**
   * Gets the most clicked area
   */
  getMostClickedArea(): Point | null {
    let maxClicks = 0;
    let hotspot: Point | null = null;

    for (const row of this.heatmapGrid) {
      for (const cell of row) {
        if (cell.clickCount > maxClicks) {
          maxClicks = cell.clickCount;
          hotspot = { x: cell.x + this.gridSize / 2, y: cell.y + this.gridSize / 2 };
        }
      }
    }

    return hotspot;
  }

  /**
   * Gets areas where player has low success rate (good for decoy placement)
   */
  getWeakAreas(): Point[] {
    const weakAreas: Point[] = [];

    for (const row of this.heatmapGrid) {
      for (const cell of row) {
        // Areas with clicks but low success rate
        if (cell.clickCount >= 3 && cell.successRate < 0.5) {
          weakAreas.push({ x: cell.x + this.gridSize / 2, y: cell.y + this.gridSize / 2 });
        }
      }
    }

    return weakAreas;
  }

  /**
   * Predicts where player is likely to click next based on patterns
   */
  predictNextClick(): Point | null {
    if (this.clickHistory.length < 3) return null;

    // Get recent clicks
    const recent = this.clickHistory.slice(-5);

    // Calculate average position (center of attention)
    let avgX = 0;
    let avgY = 0;
    for (const click of recent) {
      avgX += click.position.x;
      avgY += click.position.y;
    }
    avgX /= recent.length;
    avgY /= recent.length;

    return { x: avgX, y: avgY };
  }

  /**
   * Gets average reaction time
   */
  getAverageReactionTime(): number {
    if (this.clickHistory.length === 0) return 0;

    const sum = this.clickHistory.reduce((acc, click) => acc + click.reactionTime, 0);
    return sum / this.clickHistory.length;
  }

  /**
   * Gets overall accuracy
   */
  getAccuracy(): number {
    if (this.clickHistory.length === 0) return 0;

    const successes = this.clickHistory.filter((c) => c.wasSuccess).length;
    return successes / this.clickHistory.length;
  }

  /**
   * Detects if player has a clicking pattern (left/right/center preference)
   */
  getClickingPattern(): 'left' | 'right' | 'center' | 'balanced' {
    if (this.clickHistory.length < 10) return 'balanced';

    const centerX = this.canvasWidth / 2;
    let leftClicks = 0;
    let rightClicks = 0;
    let centerClicks = 0;

    for (const click of this.clickHistory) {
      if (click.position.x < centerX - this.canvasWidth / 6) {
        leftClicks++;
      } else if (click.position.x > centerX + this.canvasWidth / 6) {
        rightClicks++;
      } else {
        centerClicks++;
      }
    }

    const total = this.clickHistory.length;
    if (leftClicks / total > 0.5) return 'left';
    if (rightClicks / total > 0.5) return 'right';
    if (centerClicks / total > 0.5) return 'center';
    return 'balanced';
  }

  /**
   * Generates coaching tip based on player performance
   */
  getCoachingTip(): string | null {
    if (this.clickHistory.length < 10) return null;

    const accuracy = this.getAccuracy();
    const avgReactionTime = this.getAverageReactionTime();
    const pattern = this.getClickingPattern();

    // Accuracy tips
    if (accuracy < 0.5) {
      return 'Take your time! Accuracy is more important than speed.';
    }

    // Reaction time tips
    if (avgReactionTime > 1000) {
      return 'Try to react faster! Click as soon as you see a fish.';
    }

    // Pattern tips
    if (pattern !== 'balanced') {
      return `You're focusing too much on the ${pattern}. Look around the whole screen!`;
    }

    // Combo tips
    const recentSuccesses = this.clickHistory.slice(-5).filter((c) => c.wasSuccess).length;
    if (recentSuccesses >= 4) {
      return 'Great combo! Keep it up!';
    }

    return null;
  }

  /**
   * Resets analytics
   */
  reset(): void {
    this.clickHistory = [];
    this.initializeHeatmap();
  }
}
